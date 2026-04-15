import { WebSocketServer } from "ws";
import {
  addUserToOnlineUsers,
  handleDisconnect,
  handleMessage,
} from "../controller/message.controller.js";
import {
  applyMiddleware,
  checkUser,
} from "../middlewares/websocket.middleware.js";

const onlineUsers = new Map();

export default function webSocketConnection(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    applyMiddleware(ws, req, [checkUser], () => {
      addUserToOnlineUsers(ws, onlineUsers);
      ws.on("message", (raw) => {
        console.log("socket started");
        try {
          const msg = JSON.parse(raw); 
          if(msg.type=='MESSAGE'||msg){
            handleMessage(ws, msg, onlineUsers);
          }
        } catch {
          console.log("Invalid JSON");
          return;
        }
      });
    });

    ws.on("close", () => handleDisconnect(ws, onlineUsers));
    ws.on("error", (err) => console.error(`[!] WS error:`, err.message));
  });
}
