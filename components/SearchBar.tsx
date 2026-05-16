"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query)}`);
    setQuery("");
  };

  // Triggers search natively when hitting the Enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center bg-blue-950/40 border border-blue-400/30 rounded-lg overflow-hidden max-w-xs w-full transition-all focus-within:border-orange-500 focus-within:bg-blue-950/60">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search books or authors..."
        className="w-full bg-transparent px-3 py-1.5 text-sm text-white placeholder-blue-200/60 outline-none"
      />
      <button 
        onClick={handleSearch}
        type="button"
        className="px-3 py-1.5 text-blue-200 hover:text-orange-400 transition-colors cursor-pointer"
      >
        <Search className="w-4 h-4" />
      </button>
    </div>
  );
}