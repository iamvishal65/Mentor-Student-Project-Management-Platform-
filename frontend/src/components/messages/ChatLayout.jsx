import { memo, useCallback } from "react";

import ChatSidebar from "./messageSidebar/ChatSidebar";
import ChatWindow from "./chat/ChatWindow";
import WelcomeScreen from "./chat/WelcomeScreen";

const ChatLayout = ({
  chats,
  selectedChat,
  onSelectChat,
  onSendMessage,
  currentUserId,
  connectionStatus,
}) => {
  const handleBack = useCallback(() => {
    onSelectChat(null);
  }, [onSelectChat]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="hidden w-[340px] border-r border-gray-200 lg:flex dark:border-gray-800">
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={onSelectChat}
        />
      </aside>

      {/* Mobile Sidebar */}
      {!selectedChat && (
        <aside className="flex w-full lg:hidden">
          <ChatSidebar
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={onSelectChat}
          />
        </aside>
      )}

      {/* Chat Area */}
      <main className="flex min-w-0 flex-1">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            currentUserId={currentUserId}
            connectionStatus={connectionStatus}
            onSendMessage={onSendMessage}
            onBack={handleBack}
          />
        ) : (
          <div className="hidden flex-1 lg:flex">
            <WelcomeScreen />
          </div>
        )}
      </main>
    </div>
  );
};

ChatLayout.displayName = "ChatLayout";

export default memo(ChatLayout);