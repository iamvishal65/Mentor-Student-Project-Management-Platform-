import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import EmptyConversation from "./EmptyConversation";

const ChatWindow = ({
  chat,
  currentUserId,
  onSendMessage,
  onBack,
}) => {
  if (!chat) {
    return <EmptyConversation />;
  }

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <ChatHeader
        chat={chat}
        onBack={onBack}
      />

      {/* Messages */}
      <MessageList
        messages={chat.messages || []}
        currentUserId={currentUserId}
      />

      {/* Input */}
      <ChatInput
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default React.memo(ChatWindow);