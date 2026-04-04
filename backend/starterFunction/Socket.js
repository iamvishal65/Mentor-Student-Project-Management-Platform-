import { WebSocketServer } from "ws";
import { handleMessage } from "../controller/message.controller.js";

const onlineUsers = new Map();

export default function webSocketConnection(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (raw) => {
      let msg;

      try {
        msg = JSON.parse(raw);
      } catch {
        console.log("Invalid JSON");
        return;
      }

      handleMessage(ws, msg, onlineUsers);
    });

    ws.on("close", () => handleDisconnect(ws));
    ws.on("error", (err) => console.error(`[!] WS error:`, err.message));
  });
}