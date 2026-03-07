import React from 'react';
import SearchBar from '../common/SearchBar';

const MedicamentFilters = ({ 
  categories, 
  onSearch, 
  selectedCategory, 
  onCategoryChange 
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.searchWrapper}>
        <SearchBar 
          placeholder="Rechercher un médicament (Nom, DCI)..." 
          onSearch={onSearch} 
        />
      </div>
      
      <div style={styles.categoryWrapper}>
        <select 
          value={selectedCategory || ''} 
          onChange={(e) => onCategoryChange(e.target.value)}
          style={styles.select}
        >
          <option value="">Toutes les catégories</option>
          {categories && categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nom}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    flex: '1 1 300px',
  },
  categoryWrapper: {
    flex: '0 0 250px',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#fff',
    outline: 'none',
  }
};

export default MedicamentFilters;
