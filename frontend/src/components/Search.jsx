import React from "react";

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex justify-center mt-6 mb-4">

      <input
        type="text"
        placeholder="Search for a restaurant..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="
        w-full max-w-md px-4 py-2
        border border-gray-300 dark:border-gray-700
        rounded-lg shadow-sm
        bg-white dark:bg-gray-900
        text-gray-900 dark:text-white
        placeholder-gray-500 dark:placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-orange-500
        transition-colors duration-300
        "
      />

    </div>
  );
};

export default Search;