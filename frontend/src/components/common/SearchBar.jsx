import { useState, useRef, useEffect, useCallback } from 'react';
import { LuSearch, LuX } from 'react-icons/lu';

const SearchBar = ({ value = '', onSearch, placeholder = 'Rechercher...' }) => {
  const [inputValue, setInputValue] = useState(value);
  const debounceRef = useRef(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = useCallback((e) => {
    const val = e.target.value;
    setInputValue(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchRef.current(val);
    }, 350);
  }, []);

  const handleClear = useCallback(() => {
    setInputValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearchRef.current('');
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="filter-search">
      <LuSearch size={18} className="search-icon" />
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {inputValue && (
        <button className="clear-btn" onClick={handleClear}>
          <LuX size={12} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
