const {
  saveMessage,
  handleSend,
  validateMessage,
  validateReceiver,
  checkConversationState,
  createConversation,
  checkConversationExist,
  getReceiver,
  changeMessageStatus,
} = require("../services/message.service");

const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/Message.model.cjs");

function addUserToOnlineUsers(ws, onlineUsers) {
  const userId = ws.userId;
  if (!userId) {
    console.warn("addUserToOnlineUsers: ws has no userId, skipping.");
    return;
  }
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(ws);
}

async function routeMessage(ws, msg, onlineUsers) {
  if (!msg || typeof msg.type !== "string") {
    return ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Invalid message format",
      }),
    );
  }

  switch (msg.type) {
    case "PING":
      return ws.send(JSON.stringify({ type: "PONG" }));

    case "MESSAGE": {
      if (!msg.payload) {
        return ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "Payload is required",
          }),
        );
      }
      const receiverValidation = await validateReceiver(msg.payload.receiverId);

      if (!receiverValidation.success) {
        return ws.send(
          JSON.stringify({
            type: "ERROR",
            message: receiverValidation.error,
          }),
        );
      }

      const validation = validateMessage(msg.payload);

      if (!validation.success) {
        return ws.send(
          JSON.stringify({
            type: "ERROR",
            errors: validation.errors,
          }),
        );
      }

      await handleMessage(ws, validation.data, onlineUsers);
      return;
    }

    case "STATUS":
      return await handleStatus(ws, msg.payload, onlineUsers);

    case "TYPING":
      return await handleTyping(ws, msg.payload, onlineUsers);

    default:
      return ws.send(
        JSON.stringify({
          type: "ERROR",
          message: `Unknown message type: ${msg.type}`,
        }),
      );
  }
}

async function handleMessage(ws, msg, onlineUsers) {
  try {
    if (!ws?.userId) return;

    let conversationId = msg.conversationId;

    if (conversationId) {
      const existing = await checkConversationExist(conversationId);

      conversationId = existing;

      if (!conversationId) {
        conversationId = await createConversation(msg, ws.userId);
      }
    } else {
      conversationId = await checkConversationState(ws.userId, msg.receiverId);

      if (!conversationId) {
        conversationId = await createConversation(msg, ws.userId);
      }
    }

    const savedMessage = await saveMessage(conversationId, msg, ws.userId);

    const payload = {
      message: savedMessage,
      receiverId: msg.receiverId,
    };

    // Send to sender
    const senderSockets = onlineUsers.get(ws.userId);

    senderSockets?.forEach((socket) => {
      handleSend(socket, {
        type: "NEW_MESSAGE",
        payload,
      });
    });

    // Send to receiver
    const receiverSockets = getReceiver(msg, onlineUsers);

    receiverSockets?.forEach((socket) => {
      handleSend(socket, {
        type: "NEW_MESSAGE",
        payload,
      });
    });
  } catch (err) {
    console.error("handleMessage:", err);

    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Failed to send message",
      }),
    );
  }
}

async function handleStatus(ws, payload, onlineUsers) {
  try {
    await changeMessageStatus(payload.messageId, ws.userId);

    const receivers = getReceiver(
      {
        receiverId: payload.receiverId,
      },
      onlineUsers,
    );

    receivers?.forEach((socket) => {
      handleSend(socket, {
        type: "STATUS",
        payload: {
          messageId: payload.messageId,
          readBy: ws.userId,
        },
      });
    });
  } catch (err) {
    console.error(err);

    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Failed to update status",
      }),
    );
  }
}

function handleDisconnect(ws, onlineUsers) {
  const userId = ws.userId;
  if (!userId) return;
  const userSockets = onlineUsers.get(userId);
  if (!userSockets) return;

  userSockets.delete(ws);

  if (userSockets.size === 0) {
    onlineUsers.delete(userId);
  }
}

async function handleTyping(ws, payload, onlineUsers) {
  try {
    const receivers = getReceiver(
      {
        receiverId: payload.receiverId,
      },
      onlineUsers,
    );

    receivers?.forEach((socket) => {
      handleSend(socket, {
        type: "TYPING",
        payload: {
          conversationId: payload.conversationId,
          typing: payload.typing,
          senderId: ws.userId,
        },
      });
    });
  } catch (err) {
    console.error(err);

    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Failed to send typing",
      }),
    );
  }
}

async function recentChats(req, res) {
  try {
    const userId = req.token.id;
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);

    const cursorTime = req.query.cursorTime;
    const cursorId = req.query.cursorId;

    const filter = {
      participants: userId,
      lastMessage: { $ne: null },
    };

    if (cursorTime && cursorId) {
      filter.$or = [
        {
          updatedAt: { $lt: new Date(cursorTime) },
        },
        {
          updatedAt: new Date(cursorTime),
          _id: { $lt: cursorId },
        },
      ];
    }

    const conversations = await conversationModel
      .find(filter)
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "_id name userName",
        },
      })
      .sort({ updatedAt: -1, _id: -1 })
      .limit(limit + 1);
    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0, limit) : conversations;

    const nextCursor = hasNextPage
      ? {
          cursorTime: items[items.length - 1].updatedAt,
          cursorId: items[items.length - 1]._id,
        }
      : null;

    return res.json({
      success: true,
      data: items,
      nextCursor,
      hasNextPage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function checkConversation(req, res) {
  try {
    const userId = req.token.id;
    const otherUserId = req.params.otherUserId;

    const conversationId = await checkConversationState(userId, otherUserId);

    if (!conversationId) {
      return res.status(200).json({
        conversationExists: false,
        conversation: null,
      });
    }

    const conversation = await conversationModel
      .findById(conversationId)
      .populate("participants", "_id name userName")
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "_id name userName",
        },
      });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await messageModel
      .find({ conversationId })
      .populate("senderId", "_id name userName")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      conversationExists: true,
      conversation: {
        ...conversation.toObject(),
        messages,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

async function allConversations(req, res) {
  try {
    const userId = req.token.id;

    const conversations = await conversationModel
      .find({
        participants: userId,
      })
      .populate("participants", "name userName")
      .populate({
        path: "lastMessage",
        populate: {
          path: "senderId",
          select: "_id name userName",
        },
      })
      .sort({ updatedAt: -1 });

    const chats = conversations.map((conversation) => {
      const otherUser = conversation.participants.find(
        (participant) => participant._id.toString() !== userId.toString(),
      );

      return {
        conversationId: conversation._id,
        user: otherUser,
        lastMessage: conversation.lastMessage,
        updatedAt: conversation.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
}

async function getConversationById(req, res) {
  const { conversationId } = req.params;

  const conversation = await conversationModel
    .findById(conversationId)
    .populate("participants", "_id name userName")
    .populate({
      path: "lastMessage",
      populate: {
        path: "senderId",
        select: "_id name userName",
      },
    });

  const messages = await messageModel
    .find({ conversationId })
    .populate("senderId", "_id name userName")
    .sort({ createdAt: 1 });

  return res.json({
    success: true,
    conversation: {
      ...conversation.toObject(),
      messages,
    },
  });
}
module.exports = {
  handleDisconnect,
  getConversationById,
  addUserToOnlineUsers,
  routeMessage,
  recentChats,
  checkConversation,
  allConversations,
};
