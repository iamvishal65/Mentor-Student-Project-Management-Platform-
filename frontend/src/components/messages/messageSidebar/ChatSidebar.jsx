import React, { memo, useMemo } from "react";
import ChatList from "./ChatList";
import EmptyChatList from "./EmptyChatList";

const SkeletonCard = () => (
  <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
    <div className="h-12 w-12 rounded-full bg-gray-200" />
    <div className="flex-1 space-y-2">
      <div className="h-4 w-1/3 rounded bg-gray-200" />
      <div className="h-3 w-2/3 rounded bg-gray-100" />
    </div>
  </div>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M16 10.5A5.5 5.5 0 1 1 5 10.5a5.5 5.5 0 0 1 11 0Z"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 6h16M7 12h10M10 18h4"
    />
  </svg>
);

const ChatSidebar = ({
  chats = [],
  selectedChat,
  onSelectChat,
  search,
  setSearch,
  loading,
  onlineUsers = [],
}) => {
  const totalChats = chats.length;

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return chats;

    return chats.filter((chat) => {
      const participantName =
        chat.participant?.name?.toLowerCase() || "";

      const lastMessage =
        chat.lastMessage?.message?.toLowerCase() || "";

      return (
        participantName.includes(query) ||
        lastMessage.includes(query)
      );
    });
  }, [chats, search]);

  return (
    <aside className="flex h-full w-full flex-col border-r bg-white md:w-[360px]">
      {/* Header */}
      <div className="border-b px-5 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Messages
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {totalChats} Conversation{totalChats !== 1 && "s"}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </span>

            <input
              type="text"
              aria-label="Search conversations"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="button"
            className="rounded-xl border border-gray-300 p-2.5 text-gray-500 transition hover:bg-gray-100"
            aria-label="Filter conversations"
          >
            <FilterIcon />
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <EmptyChatList />
        ) : (
          <ChatList
            chats={filteredChats}
            selectedChat={selectedChat}
            onSelectChat={onSelectChat}
          />
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-5 py-3 text-sm text-gray-500">
        {onlineUsers.length > 0 ? (
          <span>
            Online <span className="font-medium">{onlineUsers.length}</span>
          </span>
        ) : (
          <span>{totalChats} Conversations</span>
        )}
      </div>
    </aside>
  );
};

export default memo(ChatSidebar);