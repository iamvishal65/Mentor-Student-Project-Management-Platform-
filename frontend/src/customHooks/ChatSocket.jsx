import { useCallback, useEffect, useRef, useState } from "react";

const WS_URL = "ws://localhost:5000";

const useChatSocket = (onMessage) => {
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
    if (!navigator.onLine) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket Connected");

      attemptRef.current = 0;
      lastPongRef.current = Date.now();

      setConnectionStatus("connected");

      clearInterval(pingIntervalRef.current);

      pingIntervalRef.current = setInterval(() => {
        if (Date.now() - lastPongRef.current > 10000) {
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

        switch (data.type) {
          case "PONG":
            lastPongRef.current = Date.now();
            break;

          case "NEW_MESSAGE":
            onMessage?.(data.payload);
            break;

          default:
            console.log("Unknown WS Event:", data.type);
        }
      } catch (err) {
        console.error(err);
      }
    };

    ws.onerror = (err) => {
      console.error(err);
      setConnectionStatus("error");
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;

      clearInterval(pingIntervalRef.current);

      if (!reconnectRef.current) return;

      if (!navigator.onLine) return;

      if (attemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
        console.log("Maximum reconnect attempts reached.");
        return;
      }

      setConnectionStatus("disconnected");

      const delay = getBackoffDelay(attemptRef.current);

      reconnectTimeoutRef.current = setTimeout(() => {
        attemptRef.current++;
        connectWS();
      }, delay);
    };
  }, [onMessage]);

  useEffect(() => {
    connectWS();

    return () => {
      reconnectRef.current = false;

      clearInterval(pingIntervalRef.current);
      clearTimeout(reconnectTimeoutRef.current);

      wsRef.current?.close();
    };
  }, [connectWS]);

  const sendMessage = (messageData) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("Socket not connected");
      return false;
    }

    wsRef.current.send(JSON.stringify(messageData));

    return true;
  };

  return {
    sendMessage,
    connectionStatus,
  };
};

export default useChatSocket;
