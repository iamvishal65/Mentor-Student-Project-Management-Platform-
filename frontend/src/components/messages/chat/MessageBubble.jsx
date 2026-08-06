import React from "react";

const MessageBubble = ({ message, currentUserId }) => {

  const msg = message.receiverId ? message.message : message;

  const isOwnMessage =
    msg.senderId?._id?.toString() === currentUserId?.toString();

  return (
    <div
      className={`mb-3 flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-xs rounded-2xl px-4 py-2 ${
          isOwnMessage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        <p>{msg.message}</p>

        <p
          className={`mt-1 text-[10px] ${
            isOwnMessage ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
