const messageModel = require("../models/Message.model.cjs");
const userModel = require("../models/User.model");
const conversationModel = require("../models/conversation.model");
const { sendMessageSchema } = require("../validators/message.validator");

function handleSend(ws, data) {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

async function saveMessage(conversationId, msg, senderId) {
  const newMessage = await messageModel.create({
    senderId,
    conversationId,
    message: msg.message,
    messageType: msg.messageType || "text",
  });

  await conversationModel.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: newMessage._id,
    },
    {
      timestamps: true, // updates updatedAt
    },
  );

  const message = await messageModel
    .findById(newMessage._id)
    .populate("senderId", "_id name userName");

  return message;
}

async function validateReceiver(id) {
  try {
    console.log("Receiver ID:", id);
    const user = await userModel.findById(id);
    console.log("Found:", user);

    if (!user) {
      return {
        success: false,
        error: "USER_NOT_FOUND",
      };
    }

    const allowed = user.roles.some((role) =>
      ["student", "mentor", "admin"].includes(role),
    );

    if (!allowed) {
      return {
        success: false,
        error: "ROLE_NOT_ALLOWED",
      };
    }

    return {
      success: true,
      data: user,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      error: "DATABASE_ERROR",
    };
  }
}

function getReceiver(msg, onlineUsers) {
  const sockets = onlineUsers.get(msg.receiverId);

  if (!sockets || sockets.size === 0) {
    return null;
  }

  return [...sockets];
}

function sendError(ws, message, code = "ERROR") {
  ws.send(
    JSON.stringify({
      type: "ERROR",
      code,
      message,
    }),
  );
}

function validateMessage(msg) {
  const result = sendMessageSchema.safeParse(msg);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}

async function checkConversationState(userId, otherUserId) {
  const participants = [userId, otherUserId].sort();

  const conversation = await conversationModel.findOne({
    participants,
  });

  return conversation ? conversation._id : null;
}

async function createConversation(msg, senderId) {
  const participants = [senderId, msg.receiverId].sort();

  const conversation = await conversationModel.create({
    participants,
  });

  return conversation._id;
}

async function checkConversationExist(conversationId) {
  const conversation = await conversationModel.findById(conversationId);

  return conversation ? conversation._id : null;
}

async function changeMessageStatus(messageId, userId) {
  // TODO
}

async function lastConversationMessages(conversationId, limit = 20) {
  return messageModel
    .find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(limit);
}

module.exports = {
  handleSend,
  saveMessage,
  validateReceiver,
  validateMessage,
  getReceiver,
  sendError,
  checkConversationState,
  createConversation,
  checkConversationExist,
  changeMessageStatus,
  lastConversationMessages,
};
