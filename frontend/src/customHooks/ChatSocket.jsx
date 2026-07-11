
import React, { useCallback, useEffect, useRef, useState } from "react";
const WS_URL = "ws://localhost:5000";

const useChatSocket = () => {
  const wsRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  

  const reconnectRef = useRef(true);
  const maxReconnectionAttempt = 10;
  const attemptRef = useRef(0);
  const delayRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const lastPongRef = useRef(Date.now());
  const pingIntervalRef = useRef(null);

  const connectWS = useCallback(() => {
    if (!navigator.onLine) {
      console.log("offline");
      return;
    }
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.onopen = () => {
      reconnectRef.current = true;
      clearTimeout(reconnectTimeoutRef.current);
      attemptRef.current = 0;
      lastPongRef.current = Date.now();

      console.log("Connected");
      pingIntervalRef.current = setInterval(() => {
        if (Date.now() - lastPongRef.current > 10000) {
            ws.close();   
            return;
        }
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "PING" }));
        }
      }, 3000);

      setConnectionStatus("connected");
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Incoming:", data);
        switch (data.type) {
          case "PONG":
            console.log("pong");
            lastPongRef.current = Date.now();
            break;
          case "NEW_MESSAGE":
            handlNewMessage(data);
            break;
          default:
            console.log("Unknown event");
        }
      } catch (err) {
        console.error(err);
      }
    };
    ws.onerror = (err) => {
      console.log("WS Error", err);
      setConnectionStatus("error");
    };
    ws.onclose = () => {
       if (wsRef.current !== ws) return;
      clearInterval(pingIntervalRef.current);
      if (!reconnectRef.current) return;
      if (!navigator.onLine) return;
      if (attemptRef.current >= maxReconnectionAttempt) return;
      setConnectionStatus("disconnected");
      reconnecting();
    };
    const reconnecting = () => {
      if (attemptRef.current >= maxReconnectionAttempt) {
        console.error("Max reconnection attempts reached.");
        return;
      }
      delayRef.current = getBackoffDelay(attemptRef.current);
      console.log(`Reconnecting in ${delayRef.current}ms`);

      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = setTimeout(() => {
        attemptRef.current++;
        connectWS();
      }, delayRef.current);
    };
    const getBackoffDelay = (attempt) => {
      const base = 500; // 0.5 second
      const max = 30000; // 30 seconds
      const jitter = Math.random() * 1000;
      return Math.min(base * 2 ** attempt + jitter, max);
    };
    
    const handlNewMessage=(data)=>{
      setMessages((prev) => [...prev, data.payload]);
    }
  }, []);

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
      return;
    }
    wsRef.current.send(JSON.stringify(messageData));
    setMessages((prev) => [
      ...prev,
      {...messageData.payload,},
    ]);
    console.log(setMessages+"hi");
    
  };

  
  return {messages,sendMessage};
};

export default useChatSocket;
