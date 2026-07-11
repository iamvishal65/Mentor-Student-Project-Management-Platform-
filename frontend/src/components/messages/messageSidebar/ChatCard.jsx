import React from "react";

const ChatCard = ({ chat, selected, onClick, className = "" }) => {
  return (
    <button
      type="button"
      onClick={() => onClick(chat)}
      className={`
        w-full h-20 px-4
        flex items-center gap-3
        rounded-xl border
        transition-all duration-200
        hover:bg-gray-50 hover:shadow-sm
        ${
          selected
            ? "border-blue-500 bg-blue-50"
            : "border-gray-200 bg-white"
        }
        ${className}
      `}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {chat?.avatar ? (
          <img
            src={chat.avatar}
            alt={chat.name}
            className="w-12 h-12 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {chat?.initials}
          </div>
        )}

        {chat?.isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
        )}
      </div>

      {/* Middle */}
      <div className="flex-1 min-w-0 text-left">
        <h3
          className={`truncate text-sm ${
            chat?.unreadCount > 0 ? "font-semibold" : "font-medium"
          } text-gray-900`}
        >
          {chat?.name}
        </h3>

        {chat?.isTyping ? (
          <p className="truncate text-sm italic text-green-600">
            Typing...
          </p>
        ) : (
          <p className="truncate text-sm text-gray-500">
            {chat?.lastMessage || "No messages yet"}
          </p>
        )}
      </div>

      {/* Right */}
      <div className="flex h-full flex-col items-end justify-between py-1 flex-shrink-0">
        <span className="text-xs text-gray-500">
          {chat?.time}
        </span>

        {chat?.unreadCount > 0 && (
          <span className="flex min-w-5 h-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-semibold text-white">
            {chat.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
};

export default React.memo(ChatCard);