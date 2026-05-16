import React, { useCallback, useEffect, useRef, useState } from "react";
import MessagePageStructure from "./MessagePageStructure";

const WS_URL = "ws://localhost:8080";

const MessagePage = () => {
  const wsRef = useRef(null);

  // ==============================
  // STATE
  // ==============================

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [selectedChat, setSelectedChat] = useState(null);

  // ==============================
  // CONNECT WS
  // ==============================

  const connectWS = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    let pingInterval;
    let attempt = 0;
    const maxReconnectionAttempt = 10;

    // ------------------------------
    // OPEN
    // ------------------------------

    ws.onopen = () => {
      console.log("Connected");
      pingInterval = setInterval(() => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: "ping" }));
        }
      }, 3000);
      setConnectionStatus("connected");
    };

    // ------------------------------
    // MESSAGE
    // ------------------------------

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Incoming:", data);
        switch (data.type) {
          case "NEW_MESSAGE":
            setMessages((prev) => [...prev, data.payload]);
            break;
          case "CHAT_HISTORY":
            setMessages(data.payload);
            break;
          default:
            console.log("Unknown event");
        }
      } catch (err) {
        console.error(err);
      }
    };

    // ------------------------------
    // ERROR
    // ------------------------------

    ws.onerror = (err) => {
      console.log("WS Error", err);
      setConnectionStatus("error");
    };

    // ------------------------------
    // CLOSE
    // ------------------------------

    ws.onclose = () => {
      clearInterval(pingInterval);
      setConnectionStatus("disconnected");

      const reconnecting = () => {
        if (attempt >= maxReconnectionAttempt) {
          console.error("Max reconnection attempts reached.");
          return;
        }
        const delay = getBackoffDelay(attempt);
        console.log(`Reconnecting in ${delay}ms`);
        setTimeout(() => {
          attempt++;
          connectWS();
        }, delay);
      };

      reconnecting();
    };
  }, []);

  const getBackoffDelay = (attempt) => {
    const base = 500; // 0.5 second
    const max = 30000; // 30 seconds
    const jitter = Math.random() * 1000;
    return Math.min(base * 2 ** attempt + jitter, max);
  };

  // ==============================
  // INITIAL CONNECT
  // ==============================

  useEffect(() => {
    connectWS();
    return () => {
      wsRef.current?.close();
    };
  }, [connectWS]);

  // ==============================
  // SEND MESSAGE
  // ==============================

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("Socket not connected");
      return;
    }
    const messageData = {
      type: "SEND_MESSAGE",
      payload: {
        chatId: selectedChat,
        content: input,
        timestamp: new Date(),
      },
    };

    wsRef.current.send(JSON.stringify(messageData));

    // optimistic update
    setMessages((prev) => [
      ...prev,
      {
        ...messageData.payload,
        self: true,
      },
    ]);

    setInput("");
  };

  // ==============================
  // SELECT CHAT
  // ==============================

  const openChat = (chatId) => {
    setSelectedChat(chatId);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "GET_CHAT_HISTORY",
          payload: { chatId },
        })
      );
    }
  };

  return (
    <MessagePageStructure
      messages={messages}
      input={input}
      setInput={setInput}
      sendMessage={sendMessage}
      selectedChat={selectedChat}
      openChat={openChat}
      connectionStatus={connectionStatus}
    />
  );
};

export default MessagePage;

export default MessagePage;
