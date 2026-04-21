const {
  saveMessage,
  getReceiver,
  handleSend,
  markMessageAsRead,
} = require("../services/message.service");
const { sendMessageSchema } = require("../validators/message.validator");

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

function handleTyping(ws, msg, onlineUsers) {
  try {
    const receiver = getReceiver(msg, onlineUsers);
    if (!receiver) return;

    handleSend(receiver, {
      type: "TYPING",
      senderId: ws.userId,
    });
  } catch (error) {
    console.error("handleTyping error:", error);
  }
}

async function handleRead(ws, msg, onlineUsers) {
  try {
    await markMessageAsRead(msg.messageId, ws.userId);

    const receiver = getReceiver(msg, onlineUsers);
    if (!receiver) return;

    handleSend(receiver, {
      type: "READ",
      messageId: msg.messageId,
      readBy: ws.userId,
    });
  } catch (error) {
    console.error("handleRead error:", error);
    ws.send(
      JSON.stringify({ type: "ERROR", message: "Failed to mark as read" })
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

function routeMessage(ws, msg, onlineUsers) {
  if (!msg || typeof msg.type !== "string") {
    ws.send(
      JSON.stringify({
        type: "ERROR",
        message: "Invalid message format",
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

    case "TYPING": {
      if (!msg.receiverId) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "receiverId is required for TYPING",
          })
        );
        return;
      }
      handleTyping(ws, msg, onlineUsers);
      break;
    }

    case "READ": {
      if (!msg.messageId) {
        ws.send(
          JSON.stringify({
            type: "ERROR",
            message: "messageId is required for READ",
          })
        );
        return;
      }
      handleRead(ws, msg, onlineUsers);
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

module.exports = {
  handleDisconnect,
  addUserToOnlineUsers,
  routeMessage,
};