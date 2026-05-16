const {
  saveMessage,
  getReceiver,
  handleSend,
  validateMessage,
  validateReceiver,
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
      })
    );
    return;
  }

  const receiverValidation = await validateReceiver(msg.receiverId);

  if (!receiverValidation.success) {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: receiverValidation.error,
      })
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
          })
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
          })
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
          })
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
          })
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
        })
      );
  }
}

async function handleMessage(ws, msg, onlineUsers) {
  try {
    if (!ws || !ws.userId) return;
    if (!onlineUsers.has(ws.userId)) return;
    await saveMessage(msg, ws.userId);
    const receiver = getReceiver(msg, onlineUsers);
    if (receiver) handleSend(receiver, msg);
  } catch (error) {
    console.error("handleMessage error:", error);
    ws.send(
      JSON.stringify({ type: "ERROR", message: "Failed to send message" })
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
      JSON.stringify({ type: "ERROR", message: "Failed to update status" })
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

async function handleTyping(ws, msg, onlineUsers){
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
      JSON.stringify({ type: "ERROR", message: "Failed to send typing" })
    );
  }
}

<<<<<<< HEAD
function notification(){}

async function recentChats(req,res){
  try {
    const recentMessages = getRecentMessages(msg, onlineUsers);
    if (!receiver) return;
  } catch (error) {
    
  }
}

async function allMentor(req,res){
  try {
    const checkReciever=h
  } catch (error) {
    
  }
}
function allStundet(req,res){}
=======
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

async function allMentor(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
    const skip = (page - 1) * limit;

    const filter = {
      role: "MENTOR",
    };

    const totalMentors = await User.countDocuments(filter);

    const mentors = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      data: mentors,
      pagination: {
        page,
        limit,
        totalDocs: totalMentors,
        totalPages: Math.ceil(totalMentors / limit),
        hasNextPage: page * limit < totalMentors,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function allStundet(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
    const skip = (page - 1) * limit;

    const filter = {
      role: "STUDENT",
    };

    const totalStudents = await User.countDocuments(filter);

    const students = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        totalDocs: totalStudents,
        totalPages: Math.ceil(totalStudents / limit),
        hasNextPage: page * limit < totalStudents,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

function notification(){}

>>>>>>> 847a40a (Initial commit)
module.exports = {
  handleDisconnect,
  addUserToOnlineUsers,
  routeMessage,
<<<<<<< HEAD
=======
  allStundet,
  allMentor,
  recentChats
>>>>>>> 847a40a (Initial commit)
}; 