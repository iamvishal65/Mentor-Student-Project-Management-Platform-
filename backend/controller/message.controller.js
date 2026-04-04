export function handleMessage(ws, msg, onlineUsers) {
  
  // 🔹 INIT → register user
  if (msg.type === "INIT") {
    const { userId } = msg;

    ws.userId = userId;
    onlineUsers.set(userId, ws);

    console.log(`User ${userId} connected`);

    ws.send(JSON.stringify({
      type: "INIT_SUCCESS",
      userId,
    }));

    return;
  }

  // 🔹 MESSAGE → send to receiver
  if (msg.type === "MESSAGE") {
    const { senderId, receiverId, text } = msg;

    const receiverWs = onlineUsers.get(receiverId);

    // simulate DB save (later replace with real DB)
    const messageData = {
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString(),
    };

    console.log("Saving message:", messageData);

    if (receiverWs) {
      receiverWs.send(JSON.stringify({
        type: "MESSAGE",
        ...messageData,
      }));
    } else {
      console.log("Receiver offline → store in DB later");
    }

    return;
  }

  // 🔹 unknown type
  ws.send(JSON.stringify({
    type: "ERROR",
    message: "Unknown message type",
  }));
}
