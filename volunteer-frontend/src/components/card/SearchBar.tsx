// SearchBar.tsx
import React from "react";
import "../../App.css"; // or HomePage.module.css

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search by keyword..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
