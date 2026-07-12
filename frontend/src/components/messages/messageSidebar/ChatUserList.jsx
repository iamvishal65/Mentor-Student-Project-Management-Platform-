import React from "react";
import ChatCard from "./ChatCard";

const ChatList = ({
  chats = [],
  selectedChat,
  onSelectChat,
}) => {
  return (
    <div className="flex flex-col">
      {chats.map((chat) => (
        <ChatCard
          key={chat.conversationId}
          chat={chat}
          selected={
            selectedChat?.conversationId === chat.conversationId
          }
          onSelect={onSelectChat}
        />
      ))}
    </div>
  );
};

export default React.memo(ChatList);