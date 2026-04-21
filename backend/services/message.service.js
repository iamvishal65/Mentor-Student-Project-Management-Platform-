const messageModel = require("../models/Message.model.cjs");
const conversationModel = require("../models/conversation.model");

function handleSend(ws, msg) {
  ws.send(
    JSON.stringify({
      type: "MESSAGE",
      message: msg,
    }),
  );
}
async function saveMessage(msg, id) {
  const senderId = id;
  const recipientId = msg.id;
  const message = msg.text;

  const participants = [senderId, recipientId].sort();
  const conversation = await conversationModel.findOneAndUpdate(
    { participants },
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
function getReciver(msg, onlineUsers) {
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

module.exports = { handleSend, saveMessage, getReciver ,sendError};
