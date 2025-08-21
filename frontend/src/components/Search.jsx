import React from 'react';

const Search = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex justify-center mt-6 mb-4">
      <input
        type="text"
        placeholder="Search for a restaurant..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
      />
    </div>
  );
};

export default Search;