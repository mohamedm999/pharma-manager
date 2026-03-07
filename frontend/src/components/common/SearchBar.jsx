import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, placeholder = "Rechercher...", delay = 500 }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, delay);

    // Nettoyer le timeout si l'utilisateur tape à nouveau avant la fin du délai
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, delay, onSearch]);

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      {searchTerm && (
        <button 
          style={styles.clearBtn} 
          onClick={() => setSearchTerm("")}
          title="Effacer"
        >
          &times;
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    maxWidth: '400px',
  },
  input: {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 1rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  },
  clearBtn: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '1.25rem',
    color: '#999',
    cursor: 'pointer',
    padding: 0,
    margin: 0,
    outline: 'none',
  }
};

export default SearchBar;
