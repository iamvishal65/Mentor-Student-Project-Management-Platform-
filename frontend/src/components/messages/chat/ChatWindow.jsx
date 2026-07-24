import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import EmptyConversation from "./EmptyConversation";

const ChatWindow = ({ chat, currentUserId, onSendMessage, onBack }) => {
  console.log("ChatWindow Chat:", chat);
  if (!chat) {
    return <EmptyConversation />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Header */}
      <ChatHeader chat={chat} onBack={onBack} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={chat.messages || []}
          currentUserId={currentUserId}
        />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default React.memo(ChatWindow);
