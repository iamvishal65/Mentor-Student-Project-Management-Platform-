function handleSend(ws,msg){
    ws.send(JSON.stringify({
    type: "MESSAGE",
    message:msg,
  }));
}