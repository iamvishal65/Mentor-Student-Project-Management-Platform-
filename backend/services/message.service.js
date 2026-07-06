const messageModel = require("../models/Message.model.cjs");
const userModel = require("../models/User.model");
const conversationModel = require("../models/conversation.model");
const { sendMessageSchema } = require("../validators/message.validator");

function handleSend(ws, msg) {
  ws.send(
    JSON.stringify({
      type: "MESSAGE",
      message: msg,
    }),
  );
}
async function saveMessage(conversationId,id,msg) {
  const senderId = id;
  const recipientId = msg.id;
  const message = msg.text;

  const participants = [senderId, recipientId].sort();
  const conversation = await conversationModel.findOneAndUpdate(
    { conversationId },
    {
      $set: {
        lastMessage: {
          text: message,
          sender: senderId,
        },
      },
      $setOnInsert: {
        participants,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  const newMessage = await messageModel.create({
    senderId: senderId,
    conversationId: conversation._id,
    message: message,
  });
}
async function validateReceiver(id) {
  try {
    const registered = await userModel.findOne({
      _id: id,
      roles: {
        $in: ["student", "mentor", "admin"],
      },
    });

    if (!registered) {
      return {
        success: false,
        error: "INVALID_RECEIVER",
      };
    }

    return {
      success: true,
      data: registered,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      error: "DATABASE_ERROR",
    };
  }
}
async function getReciver(msg, onlineUsers) {
  return onlineUsers.has(msg.id);
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
  const conversationCheck= await conversationModel.findOne({ participants });
  if(conversationCheck)return conversationCheck._id;
  else return null;
}
function createConversation(msg, id) {
  const senderId = id;
  const recipientId = msg.id;
  const participants = [senderId, recipientId].sort();
  const newConversation=conversationModel.create({
    participants:participants
  })
  return newConversation._id;
}
async function checkConversationExist(conversatioId) {
  const conversationCheck= await conversationModel.findOne({conversatioId});
  if(conversationCheck)return conversationCheck._id;
  else return null;
}
function changeMessageStatus(ws, status) {}
function lastConversationMessages() {}
module.exports = {
  handleSend,
  saveMessage,
  getReciver,
  sendError,
  validateMessage,
  validateReceiver,
  checkConversationState,
  createConversation
};
