import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      event.preventDefault();
      // Redirect to the search page with the query parameter
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`).catch((error) => {
        console.error("Error searching: ", searchTerm, error);
      });
    }
  };

  return (
    <div className="flex flex-auto px-2 rounded-md border border-gray-300">
      <button>
        <svg className="h-6 w-6">
          <path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0111 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 01-1.969 5.617zm-2.006-.742A6.977 6.977 0 0018 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 004.875-1.975l.15-.15z"></path>
        </svg>
      </button>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 focus:outline-none"
        placeholder="Search..."
      />
    </div>
  );
}