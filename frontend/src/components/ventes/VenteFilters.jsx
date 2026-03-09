import { LuEraser, LuFilter } from 'react-icons/lu';

const VenteFilters = ({ filters, onFiltersChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFiltersChange({
      ...filters,
      [name]: value,
      page: 1,
    });
  };

  const handleReset = () => {
    onFiltersChange({ page: 1 });
  };

  return (
    <div className="filters-container">
      <div className="filters-top">
        <div className="filter-group">
          <label>Date Début</label>
          <input
            type="date"
            name="date_debut"
            value={filters.date_debut || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="filter-group">
          <label>Date Fin</label>
          <input
            type="date"
            name="date_fin"
            value={filters.date_fin || ''}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div className="filter-group">
          <label>Statut</label>
          <select
            name="statut"
            value={filters.statut || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Tous les statuts</option>
            <option value="EN_COURS">En cours</option>
            <option value="COMPLETEE">Validée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>
      </div>

      <div className="filters-bottom">
        <div className="filter-group">
          <label>Total TTC (DH)</label>
          <div className="filter-dual-input">
            <input
              type="number"
              name="total_min"
              placeholder="Min"
              value={filters.total_min || ''}
              onChange={handleChange}
              className="filter-input-sm"
            />
            <span>-</span>
            <input
              type="number"
              name="total_max"
              placeholder="Max"
              value={filters.total_max || ''}
              onChange={handleChange}
              className="filter-input-sm"
            />
          </div>
        </div>

        <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Réinitialiser les filtres">
          <LuEraser size={14} /> Clear
        </button>
      </div>
    </div>
  );
};

export default VenteFilters;
