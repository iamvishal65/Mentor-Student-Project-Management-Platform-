const messageModel = require("../models/Message.model");
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

  const participants = { senderId, recipientId }.sort();
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
    senderid: senderId,
    conversationId: conversation._id,
    message: message,
  });

  
}
function getReciver(ws,onlineUsers){
  return onlineUsers.has(ws.id);
}

module.exports = { handleSend, saveMessage,getReciver};
