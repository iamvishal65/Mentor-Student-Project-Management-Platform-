const { saveMessage, getReciver, handleSend } = require("../services/websocket.service");

function addUserToOnlineUsers(ws, onlineUsers) {
  if (!ws || !ws.id) return;
  if (onlineUsers.has(ws.id)) return;
  onlineUsers.set(ws.id, ws);
}
async function handleMessage(ws, msg, onlineUsers) {
  try {
    if (!ws || !ws.id) return;
    if (!onlineUsers.has(ws.id)) return;
    await saveMessage(msg, ws.id);
    const receiver = getReciver(msg, onlineUsers);
    if(receiver)handleSend(receiver, msg);
  } catch (error) {
     console.error("handleMessage error:", error);
  }
}
function handleDisconnect(ws, onlineUsers) {
  if (!ws || !ws.id) return;
  onlineUsers.delete(ws.id);
}

module.exports={handleDisconnect,handleMessage,addUserToOnlineUsers}
