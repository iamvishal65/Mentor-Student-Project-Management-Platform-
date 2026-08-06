import { useCallback, useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL;

const useChatSocket = ({ onMessage, onStatus, onTyping, onNotification }) => {
  const wsRef = useRef(null);

  const [connectionStatus, setConnectionStatus] = useState("connecting");

  const reconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef(null);
  const pingIntervalRef = useRef(null);
  const lastPongRef = useRef(Date.now());

  const attemptRef = useRef(0);

  const MAX_RECONNECT_ATTEMPTS = 10;
  const BASE_DELAY = 500;
  const MAX_DELAY = 30000;

  const getBackoffDelay = (attempt) => {
    const jitter = Math.random() * 1000;
    return Math.min(BASE_DELAY * 2 ** attempt + jitter, MAX_DELAY);
  };

  const connectWS = useCallback(() => {
    if (!navigator.onLine) {
      setConnectionStatus("offline");
      return;
    }

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected");

      attemptRef.current = 0;
      lastPongRef.current = Date.now();

      setConnectionStatus("connected");

      clearInterval(pingIntervalRef.current);

      pingIntervalRef.current = setInterval(() => {
        if (Date.now() - lastPongRef.current > 10000) {
          console.warn("Heartbeat timeout. Closing socket...");
          ws.close();
          return;
        }

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "PING" }));
        }
      }, 3000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("WS Received:", data);
        switch (data.type) {
          case "PONG":
            lastPongRef.current = Date.now();
            break;

          case "NEW_MESSAGE":
            onMessage?.(data.payload);
            break;

          case "STATUS":
            onStatus?.(data.payload);
            break;

          case "TYPING":
            onTyping?.(data.payload);
            break;

          case "NOTIFICATION":
            onNotification?.(data.payload);
            break;

          case "ERROR":
            console.error("WebSocket Error:", data.message || data.errors);
            break;

          default:
            console.warn("Unknown WS Event:", data);
        }
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket Error:", err);
      setConnectionStatus("error");
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;

      clearInterval(pingIntervalRef.current);

      if (!reconnectRef.current) return;

      if (!navigator.onLine) {
        setConnectionStatus("offline");
        return;
      }

      if (attemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.error("Maximum reconnect attempts reached.");
        setConnectionStatus("failed");
        return;
      }

      setConnectionStatus("reconnecting");

      const delay = getBackoffDelay(attemptRef.current);

      reconnectTimeoutRef.current = setTimeout(() => {
        attemptRef.current++;
        connectWS();
      }, delay);
    };
  }, [onMessage, onStatus, onTyping, onNotification]);

  useEffect(() => {
    reconnectRef.current = true;
    connectWS();

    return () => {
      reconnectRef.current = false;

      clearInterval(pingIntervalRef.current);
      clearTimeout(reconnectTimeoutRef.current);

      wsRef.current?.close();
    };
  }, [connectWS]);

  const sendMessage = useCallback((data) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("Socket not connected.");
      return false;
    }

    wsRef.current.send(JSON.stringify(data));
    return true;
  }, []);

  return {
    sendMessage,
    connectionStatus,
    socket: wsRef.current,
  };
};

export default useChatSocket;
