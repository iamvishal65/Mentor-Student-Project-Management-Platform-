import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages = [], currentUserId }) => {
  const bottomRef = useRef(null);
  console.log("First message:", messages[0]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
      {messages.map((message, index) => (
        <MessageBubble
          key={message._id || index}
          message={message}
          currentUserId={currentUserId}
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default React.memo(MessageList);
