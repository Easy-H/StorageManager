import React from 'react';

const SearchBar = ({ value, onChange }) => (
  <div className="search-section">
    <input 
      placeholder="품목 이름 검색..." 
      value={value}
      onChange={e => onChange(e.target.value)} 
      className="search-input" 
    />
  </div>
);

export default SearchBar;