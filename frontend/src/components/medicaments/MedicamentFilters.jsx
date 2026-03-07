import SearchBar from '../common/SearchBar';
import useCategories from '../../hooks/useCategories';

const MedicamentFilters = ({ filters, onFiltersChange }) => {
  const { data: categories } = useCategories();

  const handleSearch = (search) => {
    onFiltersChange({ ...filters, search, page: 1 });
  };

  const handleCategoryChange = (e) => {
    const categorie = e.target.value;
    onFiltersChange({ ...filters, categorie, page: 1 });
  };

  return (
    <div className="filters-bar">
      <SearchBar
        value={filters.search || ''}
        onSearch={handleSearch}
        placeholder="Rechercher par nom, DCI..."
      />
      <div className="filter-select">
        <select value={filters.categorie || ''} onChange={handleCategoryChange}>
          <option value="">Toutes les catégories</option>
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};

export default MedicamentFilters;
