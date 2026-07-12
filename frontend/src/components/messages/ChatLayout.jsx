import { memo } from "react";

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
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[340px] border-r border-gray-200 dark:border-gray-800">
        <ChatSidebar
          chats={chats}
          selectedChat={selectedChat}
          onSelectChat={onSelectChat}
        />
      </aside>

      {/* Mobile Sidebar */}
      {!selectedChat && (
        <aside className="flex lg:hidden w-full">
          <ChatSidebar
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={onSelectChat}
          />
        </aside>
      )}

      {/* Chat Area */}
      <main className="flex flex-1 min-w-0">
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            currentUserId={currentUserId}
            connectionStatus={connectionStatus}
            onSendMessage={onSendMessage}
            onBack={() => onSelectChat(null)}
          />
        ) : (
          <div className="hidden lg:flex flex-1">
            <WelcomeScreen />
          </div>
        )}
      </main>
    </div>
  );
};

export default memo(ChatLayout);