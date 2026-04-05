function addUserToOnlineUsers(ws,onlineUsers){
  if(!ws||!ws.id)return;
  if(onlineUsers.has(ws.id))return;

  onlineUsers.set(ws.id,ws)
}
function handleMessage(ws, msg, onlineUsers) {
  if(!ws||!ws.id)return;
  if(!onlineUsers.has(ws.id))return;
  const receiver=getReceiver(ws,onlineUsers);
  send(receiver,msg);
}
function handleDisconnect(ws,onlineUsers){
  
}
