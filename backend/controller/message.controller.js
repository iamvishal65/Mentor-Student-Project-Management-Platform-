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
    const receiver = getReceiver(msg, onlineUsers);
    if(receiver)send(receiver, msg);
    
    
  } catch (error) {
    
  }
}
function handleDisconnect(ws, onlineUsers) {}

module.exports={handleDisconnect,handleMessage,addUserToOnlineUsers}
