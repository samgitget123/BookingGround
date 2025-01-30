import React, { useState } from 'react';

const SearchBar = ({ data, onSearch }) => {
 
  
  const [query, setQuery] = useState("");  // Manage the search query locally

  const handleInputChange = (e) => {
    const searchValue = e.target.value;  // Extract search query from the event object
    setQuery(searchValue);

    // Filter the data based on the search query
    const filteredData = data.filter((item) =>
      item.data?.name && item.data.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    
    
    // Pass the filtered data back to the parent component
    onSearch(filteredData);  // Pass filtered data to parent
  };

  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search for grounds..."
          value={query} 
          onChange={handleInputChange}  // Pass the event object to handleInputChange
        />
        <i className="fas fa-search search-icon"></i>
      </div>
    </div>
  );
};

export default SearchBar;
