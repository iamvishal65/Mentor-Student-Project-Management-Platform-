
import React, { useCallback, useEffect, useRef, useState } from "react";
const WS_URL = "ws://localhost:8080";

const useChatSocket = () => {
  const wsRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  

  const reconnectRef = useRef(true);
  const maxReconnectionAttempt = 10;
  const attemptRef = useRef(0);
  const delayRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
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

      console.log("Connected");
      pingIntervalRef.current = setInterval(() => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "ping" }));
        }
      }, 3000);
      setConnectionStatus("connected");
    };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Incoming:", data);
        switch (data.type) {
          case "NEW_MESSAGE":
            handlNewMessage(data);
            break;

          case "CHAT_HISTORY":
            handleHistory(data);
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
    const handleHistory=(data)=>{
      setMessages(data.payload);
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

  const sendMessage = (input) => {
    if (!input.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("Socket not connected");
      return;
    }
    const messageData = {
      type: "SEND_MESSAGE",
      payload: {
        receiverId: selectedChat,
        content: input,
        timestamp: new Date(),
        conversationId:conversationId
      },
    };
    wsRef.current.send(JSON.stringify(messageData));
    // optimistic update
    setMessages((prev) => [
      ...prev,
      {
        ...messageData.payload,
      },
    ]);
    setInput("");
  };

  const openChat = (chatId) => {
    setSelectedChat(chatId);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "GET_CHAT_HISTORY",
          payload: { chatId },
        }),
      );
    }
  };

  return {messages,conversationId};
};

export default useChatSocket;
