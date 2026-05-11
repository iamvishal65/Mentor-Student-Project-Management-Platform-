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