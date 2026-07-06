// SearchBar.jsx
import React, { useState } from "react";

export default function SearchBarStructure({
  onSearch,
  className ,
}) {
  const [value, setValue] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="text"
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search..."
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
