import React from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";

const ChatHeader = ({ chat, onBack }) => {
  console.log(chat);

  const fullName = chat?.user?.name || chat?.user?.Name || "Unknown User";
  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex items-center justify-between border-b bg-white p-4">
      <div className="flex items-center gap-3">
        {/* Mobile Back */}
        <button
          onClick={onBack}
          className="rounded-full p-2 hover:bg-gray-100 lg:hidden"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Avatar */}
        {chat?.user?.profileImage ? (
          <img
            src={chat.user.profileImage}
            alt={fullName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
            {initials}
          </div>
        )}

        {/* User Name */}
        <div>
          <h2 className="font-semibold">{fullName || "Unknown User"}</h2>

          <p className="text-sm text-gray-500">Conversation</p>
        </div>
      </div>

      {/* More Button */}
      <button className="rounded-full p-2 hover:bg-gray-100">
        <MoreVertical size={20} />
      </button>
    </header>
  );
};

export default React.memo(ChatHeader);
