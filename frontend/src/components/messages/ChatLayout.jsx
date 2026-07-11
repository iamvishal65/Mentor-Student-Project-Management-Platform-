import { memo } from "react";
import ChatSidebar from "./messageSidebar/ChatSidebar";
import ChatWindow from "./chat/ChatWindow";
import WelcomeScreen from "./chat/WelcomeScreen";

const ChatLayout = ({
  selectedChat,
  setSelectedChat,
  conversations,
  messages,
  currentUser,
  onlineUsers,
  loading,
  sendMessage,
}) => {
  const handleBack = () => setSelectedChat(null);

  return (
    <div className="flex h-screen overflow-hidden bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      {/* Mobile Layout */}
      <div className="flex h-full w-full lg:hidden">
        {!selectedChat ? (
          <aside
            className="flex h-full w-full flex-col overflow-hidden border-r border-gray-200 dark:border-gray-800"
            aria-label="Conversations"
          >
            <div className="flex-1 overflow-y-auto">
              <ChatSidebar
                conversations={conversations}
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
                loading={loading}
              />
            </div>
          </aside>
        ) : (
          <main
            className="flex min-w-0 flex-1 flex-col overflow-hidden"
            aria-label="Chat conversation"
          >
            {loading ? (
              <section className="flex flex-1 items-center justify-center">
                <div
                  className="flex items-center gap-3"
                  role="status"
                  aria-live="polite"
                >
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading conversation...
                  </span>
                </div>
              </section>
            ) : (
              <ChatWindow
                selectedChat={selectedChat}
                messages={messages}
                currentUser={currentUser}
                onlineUsers={onlineUsers}
                sendMessage={sendMessage}
                onBack={handleBack}
              />
            )}
          </main>
        )}
      </div>

      {/* Desktop / Tablet Layout */}
      <div className="hidden h-full w-full lg:flex">
        <aside
          className="flex h-full w-[300px] shrink-0 flex-col overflow-hidden border-r border-gray-200 dark:border-gray-800 xl:w-[350px]"
          aria-label="Conversations"
        >
          <div className="flex-1 overflow-y-auto">
            <ChatSidebar
              conversations={conversations}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              loading={loading}
            />
          </div>
        </aside>

        <main
          className="flex min-w-0 flex-1 flex-col overflow-hidden"
          aria-label="Chat conversation"
        >
          {loading ? (
            <section className="flex flex-1 items-center justify-center">
              <div
                className="flex items-center gap-3"
                role="status"
                aria-live="polite"
              >
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Loading conversation...
                </span>
              </div>
            </section>
          ) : !selectedChat ? (
            <section className="flex flex-1 overflow-hidden">
              <WelcomeScreen />
            </section>
          ) : (
            <section className="flex flex-1 min-w-0 overflow-hidden">
              <ChatWindow
                selectedChat={selectedChat}
                messages={messages}
                currentUser={currentUser}
                onlineUsers={onlineUsers}
                sendMessage={sendMessage}
                onBack={handleBack}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default memo(ChatLayout);