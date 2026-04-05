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
        switch(msg.type){
          case "INIT" : addUserToOnlineUsers(ws,onlineUsers); break;
          case "MESSAGE" :handleMessage(ws, msg, onlineUsers); break;
        }
      } catch {
        console.log("Invalid JSON");
        return;
      }
    });

    ws.on("close", () => handleDisconnect(ws,onlineUsers));
    ws.on("error", (err) => console.error(`[!] WS error:`, err.message));
  });
}