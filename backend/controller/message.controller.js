const {
  saveMessage,
  getReceiver,
  handleSend,
  validateMessage,
  validateReceiver,
  checkConversationState,
  createConversation,
} = require("../services/message.service");

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
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Invalid message format",
      }),
    );
    return;
  }

  const receiverValidation = await validateReceiver(msg.receiverId);

  if (!receiverValidation.success) {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: receiverValidation.error,
      }),
    );
    return;
  }

  switch (msg.type) {
    case "MESSAGE": {
      const result = validateMessage(msg);

      if (!result.success) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            errors: result.errors,
          }),
        );
        return;
      }

      handleMessage(ws, result.data, onlineUsers);
      break;
    }

    case "STATUS": {
      if (!msg.messageId) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "messageId is required for status",
          }),
        );
        return;
      }

      handleStatus(ws, msg, onlineUsers);
      break;
    }

    case "TYPING": {
      if (!msg.messageId) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "messageId is required for typing",
          }),
        );
        return;
      }

      handleTyping(ws, msg, onlineUsers);
      break;
    }

    case "NOTIFICATION": {
      if (!msg.messageId) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "messageId is required for notification",
          }),
        );
        return;
      }

      handleNotification(ws, msg, onlineUsers);
      break;
    }

    default:
      ws.send(
        JSON.stringify({
          type: "ERROR",
          message: `Unknown message type: ${msg.type}`,
        }),
      );
  }
}

async function handleMessage(ws, msg, onlineUsers) {
  try {
    if (!ws || !ws.userId) return;
    if (!onlineUsers.has(ws.userId)) return;
    let conversation=msg.conversationId;
    if (conversation) {
      const conversationExist=checkConversationExisted(conversation);
      if (conversationExist == null) {
        conversation = createConversation(msg, ws.userId);
      }
    } else {
      conversation = checkConversationState(ws.userId, msg.id);
      if (conversation == null) {
        conversation = createConversation(msg, ws.userId);
      }
    }
    await saveMessage(conversation,msg, ws.userId);
    const receiver = getReceiver(msg, onlineUsers);
    if (receiver) handleSend(receiver, msg);
  } catch (error) {
    console.error("handleMessage error:", error);
    ws.send(
      JSON.stringify({ type: "ERROR", message: "Failed to send message" }),
    );
  }
}

async function handleStatus(ws, msg, onlineUsers) {
  try {
    await changeMessageStatus(msg.messageId, ws.userId);
    const receiver = getReceiver(msg, onlineUsers);
    if (!receiver) return;

    handleSend(receiver, {
      type: status,
      messageId: msg.messageId,
      readBy: ws.userId,
    });
  } catch (error) {
    console.error("handleStatus error:", error);
    ws.send(
      JSON.stringify({ type: "ERROR", message: "Failed to update status" }),
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

async function handleTyping(ws, msg, onlineUsers) {
  try {
    const receiver = getReceiver(msg, onlineUsers);
    if (!receiver) return;

    handleSend(receiver, {
      type: "TYPING",
      messageId: msg.messageId,
      readBy: ws.userId,
    });
  } catch (error) {
    console.error("handleTyping error:", error);
    ws.send(
      JSON.stringify({ type: "ERROR", message: "Failed to send typing" }),
    );
  }
}

async function recentChats(req, res) {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);

    const cursorTime = req.query.cursorTime;
    const cursorId = req.query.cursorId;

    const filter = {
      participants: userId,
      lastMessage: { $ne: null },
    };

    if (cursorTime && cursorId) {
      filter.$or = [
        { "lastMessage.createdAt": { $lt: new Date(cursorTime) } },
        {
          "lastMessage.createdAt": new Date(cursorTime),
          _id: { $lt: cursorId },
        },
      ];
    }

    const conversations = await Conversation.find(filter)
      .sort({ "lastMessage.createdAt": -1, _id: -1 })
      .limit(limit + 1);

    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0, limit) : conversations;

    const nextCursor = hasNextPage
      ? {
          cursorTime: items[items.length - 1].lastMessage.createdAt,
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

    const conversation = await checkConversationState(userId, otherUserId);

    if (!conversation) {
      return res.status(200).json({
        conversationExists: false,
        conversation: null,
        message: "Conversation not created yet",
      });
    }

    return res.status(200).json({
      conversationExists: true,
      conversation,
      message: "Conversation found",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  handleDisconnect,
  addUserToOnlineUsers,
  routeMessage,
  recentChats,
  checkConversation,
};
