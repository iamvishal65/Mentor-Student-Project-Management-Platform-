import React from "react";

const ChatCard = ({ chat, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(chat)}
      className={`w-full flex items-center gap-3 p-3 border-b hover:bg-gray-100 transition ${
        selected ? "bg-blue-50" : "bg-white"
      }`}
    >
      {/* Avatar */}
      {chat?.user?.profilePicture ? (
        <img
          src={chat.user.profilePicture}
          alt={chat.user.name || chat.user.Name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
          {chat?.user?.name?.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Name & Last Message */}
      <div className="flex-1 text-left overflow-hidden">
        <h3 className="font-medium truncate">
          {chat?.user?.name}
        </h3>

        <p className="text-sm text-gray-500 truncate">
          {chat?.messages?.length
            ? chat.messages[chat.messages.length - 1].message
            : "No messages yet"}
        </p>
      </div>
    </button>
  );
};

export default React.memo(ChatCard);