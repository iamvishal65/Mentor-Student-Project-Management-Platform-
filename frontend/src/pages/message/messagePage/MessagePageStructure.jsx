
import React, { useState, useMemo } from "react";

const messagesData = [
  { id: 1, name: "Aman", role: "student", message: "Hi bro" },
  { id: 2, name: "Rahul", role: "mentor", message: "Check your project" },
  { id: 3, name: "Sneha", role: "student", message: "Need help" },
];

// 🔹 Header Component
function MessageHeader({ search, setSearch, toggleMenu }) {
  return (
    <div className="flex items-center mb-4">
      
      {/* Search takes full space */}
      <input
        type="text"
        placeholder="Search messages..."
        className="border px-3 py-2 flex-1 rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Proper spacing */}
      <button
        onClick={toggleMenu}
        className="text-2xl ml-3"
      >
        ☰
      </button>
    </div>
  );
}

// 🔹 Filter Menu
function FilterMenu({ setFilter, closeMenu }) {
  const options = ["recent", "student", "mentor"];

  return (
    <div className="border mb-4 rounded-md shadow bg-white">
      {options.map((opt) => (
        <div
          key={opt}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
          onClick={() => {
            setFilter(opt);
            closeMenu();
          }}
        >
          {opt}
        </div>
      ))}
    </div>
  );
}

// 🔹 Message Item
function MessageItem({ msg }) {
  return (
    <div className="border-b py-3 flex justify-between items-center">
      <div>
        <div className="font-semibold">{msg.name}</div>
        <div className="text-sm text-gray-500">{msg.message}</div>
      </div>

      <span className="text-xs px-2 py-1 bg-gray-200 rounded">
        {msg.role}
      </span>
    </div>
  );
}

// 🔹 Message List
function MessageList({ messages }) {
  if (messages.length === 0) {
    return <div className="text-gray-500">No messages found</div>;
  }

  return (
    <div>
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} />
      ))}
    </div>
  );
}

// 🔹 Main Page
export default function MessagePageStructure() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("recent");
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔹 Optimized filtering (important)
  const filteredMessages = useMemo(() => {
    return messagesData.filter((msg) => {
      const matchesSearch = msg.name
        .toLowerCase()
        .includes(search.toLowerCase());

      if (filter === "recent") return matchesSearch;
      return matchesSearch && msg.role === filter;
    });
  }, [search, filter]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <MessageHeader
        search={search}
        setSearch={setSearch}
        toggleMenu={() => setMenuOpen((prev) => !prev)}
      />

      {menuOpen && (
        <FilterMenu
          setFilter={setFilter}
          closeMenu={() => setMenuOpen(false)}
        />
      )}

      <MessageList messages={filteredMessages} />
    </div>
  );
}

import React, { useState } from "react";

export default function MessagePageStructure({
  users = [],
  selectedUser,
  setSelectedUser,
  messages = [],
  input,
  setInput,
  sendMessage,
  setActiveTab,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      {/* TOP BAR */}
      <div className="flex items-center justify-between border-b p-3">
        <h1 className="font-bold text-lg">Chats</h1>

        {/* MENU */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            ☰
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-40 border rounded bg-white shadow">
              <div
                onClick={() => {
                  setActiveTab("recent");
                  setMenuOpen(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                Recent Chats
              </div>

              <div
                onClick={() => {
                  setActiveTab("mentor");
                  setMenuOpen(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                All Mentors
              </div>

              <div
                onClick={() => {
                  setActiveTab("student");
                  setMenuOpen(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                All Students
              </div>
            </div>
          )}
        </div>
      </div>

      {/* USER LIST */}
      {!selectedUser && (
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {users.length === 0 ? (
            <div className="text-gray-500">No chat till now</div>
          ) : (
            users.map((user) => (
              <div
                key={user._id || user.id}
                onClick={() => setSelectedUser(user)}
                className="p-3 border rounded cursor-pointer hover:bg-gray-100"
              >
                {user.name}
              </div>
            ))
          )}
        </div>
      )}

      {/* CHAT SCREEN */}
      {selectedUser && (
        <div className="flex-1 flex flex-col">
          {/* USER NAME */}
          <div className="border-b p-3 font-semibold flex items-center gap-3">
            <button onClick={() => setSelectedUser(null)} className="text-xl">
              ←
            </button>

            {selectedUser.name}
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 ? (
              <div className="text-gray-500">No messages</div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[300px] p-2 rounded ${
                    msg.self ? "bg-black text-white ml-auto" : "bg-gray-200"
                  }`}
                >
                  {msg.content}
                </div>
              ))
            )}
          </div>

          {/* INPUT */}
          <div className="border-t p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 border rounded px-3 py-2"
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

