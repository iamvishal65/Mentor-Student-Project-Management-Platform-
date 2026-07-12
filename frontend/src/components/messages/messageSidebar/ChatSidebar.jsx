import React from "react";
import ChatList from "./ChatUserList";
import EmptyChatList from "./EmptyUserChatList";

const ChatSidebar = ({
  chats = [],
  selectedChat,
  onSelectChat,
}) => {
  return (
    <aside className="flex flex-col w-full h-full border-r bg-white">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Messages</h2>

        <p className="text-sm text-gray-500">
          {chats.length} Conversation{chats.length !== 1 && "s"}
        </p>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <EmptyChatList />
        ) : (
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={onSelectChat}
          />
        )}
      </div>
    </aside>
  );
};

export default React.memo(ChatSidebar);