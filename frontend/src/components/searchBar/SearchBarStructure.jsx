// SearchBar.jsx
import React from "react";

export default function SearchBarStructure({
  value,
  onChange,
  onSearch,
  placeholder = "Search...",
  className = "",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border px-3 py-2 outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Search
      </button>
    </form>
  );
}
