import React, { useState } from "react";

export default function MessagePageStructure({
  chats = [],
  selectedChat,
  setSelectedChat,
  currentUserId,
  onSendMessage = () => {},
}) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;
    onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid h-[88vh] overflow-hidden rounded-3xl border border-white/10 bg-[#161b22] lg:grid-cols-[320px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="flex flex-col border-r border-white/10">
            <div className="border-b border-white/10 p-5">
              <h1 className="text-xl font-semibold">Messages</h1>
            </div>

            <div className="flex-1 overflow-y-auto">
              {chats.length > 0 ? (
                chats.map((chat) => (
                  <button
                    key={chat._id}
                    onClick={() => setSelectedChat(chat)}
                    className={`flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-white/5 ${
                      selectedChat?.user?._id === chat.user?._id
                        ? "bg-white/5"
                        : ""
                    }`}
                  >
                    <img
                      src={chat.user?.profilePicture || "/default-avatar.png"}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-medium">
                        {chat.user?.userName}
                      </h2>

                      <p className="truncate text-sm text-slate-400">
                        {chat.lastMessage || "No messages"}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-slate-500">
                  No conversations yet
                </div>
              )}
            </div>
          </aside>

          {/* Right */}
          <main className="flex flex-col bg-[#0f141a]">
            {!selectedChat ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold">
                    Welcome to Messages
                  </h2>

                  <p className="mt-3 text-slate-400">
                    Select a user to start chatting.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-white/10 bg-[#202c33] px-6 py-4">
                  <img
                    src={
                      selectedChat.user?.profilePicture ||
                      "/default-avatar.png"
                    }
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedChat.user?.userName}
                    </h2>

                    <p className="text-sm text-slate-400">
                      {selectedChat.conversationExists
                        ? "Conversation"
                        : "Start a new conversation"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5">
                  {selectedChat.conversationExists ? (
                    selectedChat.messages?.length > 0 ? (
                      <div className="space-y-3">
                        {selectedChat.messages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                              msg.senderId === currentUserId
                                ? "ml-auto bg-green-600"
                                : "bg-[#202c33]"
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        No messages yet
                      </div>
                    )
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <img
                        src={
                          selectedChat.user?.profilePicture ||
                          "/default-avatar.png"
                        }
                        alt=""
                        className="mb-5 h-28 w-28 rounded-full object-cover"
                      />

                      <h2 className="text-3xl font-semibold">
                        {selectedChat.user?.userName}
                      </h2>

                      <p className="mt-3 text-slate-400">
                        Start your first conversation with{" "}
                        <span className="font-semibold text-white">
                          {selectedChat.user?.Name}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="border-t border-white/10 bg-[#202c33] p-4">
                  <form
                    onSubmit={handleSubmit}
                    className="flex items-center gap-3"
                  >
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Message ${
                        selectedChat.user?.userName || ""
                      }`}
                      className="flex-1 rounded-full bg-[#2a3942] px-5 py-3 outline-none placeholder:text-slate-400"
                    />

                    <button
                      type="submit"
                      className="rounded-full bg-green-600 px-6 py-3 font-medium hover:bg-green-500"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}