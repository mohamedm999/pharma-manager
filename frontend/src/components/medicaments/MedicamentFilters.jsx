import { LuEraser } from 'react-icons/lu';
import SearchBar from '../common/SearchBar';
import useCategories from '../../hooks/useCategories';

const MedicamentFilters = ({ filters, onFiltersChange }) => {
  const { data: categories } = useCategories();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFiltersChange({
      ...filters,
      [name]: type === 'checkbox' ? (checked ? 'true' : '') : value,
      page: 1,
    });
  };

  const handleSearch = (search) => {
    onFiltersChange({ ...filters, search, page: 1 });
  };

  const handleReset = () => {
    onFiltersChange({ page: 1 });
  };

  return (
    <div className="filters-container">
      <div className="filters-top">
        <SearchBar
          value={filters.search || ''}
          onSearch={handleSearch}
          placeholder="Rechercher par nom, DCI..."
        />
        <div className="filter-select">
          <select 
            name="categorie" 
            value={filters.categorie || ''} 
            onChange={handleChange}
          >
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

      <div className="filters-bottom">
        <div className="filter-group">
          <label>Prix (DH)</label>
          <div className="filter-dual-input">
            <input
              type="number"
              name="prix_min"
              placeholder="Min"
              value={filters.prix_min || ''}
              onChange={handleChange}
              className="filter-input-sm"
            />
            <span>-</span>
            <input
              type="number"
              name="prix_max"
              placeholder="Max"
              value={filters.prix_max || ''}
              onChange={handleChange}
              className="filter-input-sm"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Stock Min</label>
          <input
            type="number"
            name="stock_min"
            placeholder="Ex: 5"
            value={filters.stock_min || ''}
            onChange={handleChange}
            className="filter-input-sm"
          />
        </div>

        <div className="filter-group checkbox-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              name="ordonnance_requise"
              checked={filters.ordonnance_requise === 'true'}
              onChange={handleChange}
            />
            Ordonnance
          </label>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Réinitialiser les filtres">
          <LuEraser size={14} /> Clear
        </button>
      </div>
    </div>
  );
};

export default MedicamentFilters;
