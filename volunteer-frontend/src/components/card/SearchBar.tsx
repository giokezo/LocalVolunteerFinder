import React from 'react';
import './SearchBar.css'; // optional if you want to style later

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by keyword..."
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
