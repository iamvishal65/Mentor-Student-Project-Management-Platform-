import { WebSocketServer } from "ws";
import {
  addUserToOnlineUsers,
  handleDisconnect,
  routeMessage,
} from "../controller/message.controller.js";
import {
  applyMiddleware,
  checkRole,
  checkUser,
} from "../middlewares/websocket.middleware.js";

const onlineUsers = new Map();

export default function webSocketConnection(server) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    applyMiddleware(ws, req, [checkUser,checkRole], () => {
      addUserToOnlineUsers(ws, onlineUsers);
      ws.on("message", (raw) => {
        try {
          const msg = JSON.parse(raw);
          console.log("PARSED:", msg);

          routeMessage(ws, msg, onlineUsers);
        } catch {
          ws.send(
            JSON.stringify({ type: "ERROR", message: "Invalid JSON format" })
          );
        }
      });

      ws.on("close", () => handleDisconnect(ws, onlineUsers));
      ws.on("error", (err) => console.error(`[!] WS error:`, err.message));
    });
  });
}