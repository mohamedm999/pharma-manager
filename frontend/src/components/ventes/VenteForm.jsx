import { useState, useRef, useEffect, useCallback } from 'react';
import { LuSearch, LuPlus, LuX, LuShoppingCart } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { fetchMedicaments } from '../../api/medicamentsApi';

const VenteForm = ({ onSubmit, onCancel }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lignes, setLignes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Search medicaments
  const doSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const data = await fetchMedicaments({ search: query });
      const results = data.results || data || [];
      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } catch {
      setSearchResults([]);
    }
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const addMedicament = (med) => {
    // Check if already in list
    if (lignes.find((l) => l.medicament === med.id)) {
      toast.error(`"${med.nom}" est déjà dans la vente`);
      return;
    }
    if (med.stock_actuel <= 0) {
      toast.error(`"${med.nom}" est en rupture de stock`);
      return;
    }
    setLignes([
      ...lignes,
      {
        medicament: med.id,
        nom: med.nom,
        dci: med.dci,
        prix_unitaire: Number(med.prix_vente),
        quantite: 1,
        stock_dispo: med.stock_actuel,
      },
    ]);
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  const updateQuantite = (index, qty) => {
    const val = Math.max(1, parseInt(qty) || 1);
    setLignes((prev) =>
      prev.map((l, i) => (i === index ? { ...l, quantite: val } : l))
    );
  };

  const removeLigne = (index) => {
    setLignes((prev) => prev.filter((_, i) => i !== index));
  };

  const total = lignes.reduce(
    (sum, l) => sum + l.prix_unitaire * l.quantite,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lignes.length === 0) {
      toast.error('Ajoutez au moins un médicament à la vente');
      return;
    }

    // Validate quantities
    for (const l of lignes) {
      if (l.quantite > l.stock_dispo) {
        toast.error(
          `Quantité de "${l.nom}" (${l.quantite}) dépasse le stock disponible (${l.stock_dispo})`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const payload = {
        lignes: lignes.map((l) => ({
          medicament: l.medicament,
          quantite: l.quantite,
        })),
      };
      await onSubmit(payload);
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.lignes;
      toast.error(
        typeof detail === 'string'
          ? detail
          : 'Erreur lors de la création de la vente'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Search Section */}
      <div ref={searchRef} style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
          <LuSearch size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />
          Rechercher un médicament
        </label>
        <div className="filter-search" style={{ flex: 'none' }}>
          <LuSearch size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tapez le nom ou DCI..."
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => {
                setSearchQuery('');
                setShowDropdown(false);
              }}
            >
              <LuX size={12} />
            </button>
          )}
        </div>

        {showDropdown && (
          <div className="vente-search-dropdown">
            {searchResults.map((med) => (
              <div
                key={med.id}
                className="vente-search-dropdown-item"
                onClick={() => addMedicament(med)}
              >
                <div>
                  <span className="med-name">{med.nom}</span>
                  {med.dci && <span className="med-dci">({med.dci})</span>}
                </div>
                <div className="med-meta">
                  <span>{Number(med.prix_vente).toFixed(2)} DH</span>
                  <span>
                    Stock:{' '}
                    <strong
                      style={{
                        color:
                          med.stock_actuel <= 0
                            ? 'var(--danger-500)'
                            : med.est_en_alerte
                            ? 'var(--warning-600)'
                            : 'var(--success-600)',
                      }}
                    >
                      {med.stock_actuel}
                    </strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Line items table */}
      {lignes.length > 0 ? (
        <>
          <div className="table-container" style={{ marginBottom: '1.25rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Médicament</th>
                  <th>Prix unit.</th>
                  <th>Quantité</th>
                  <th>Sous-total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((ligne, idx) => (
                  <tr key={ligne.medicament}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ligne.nom}</div>
                      {ligne.dci && (
                        <div className="table-subtext">{ligne.dci}</div>
                      )}
                    </td>
                    <td>{ligne.prix_unitaire.toFixed(2)} DH</td>
                    <td>
                      <input
                        type="number"
                        className="qty-input"
                        min="1"
                        max={ligne.stock_dispo}
                        value={ligne.quantite}
                        onChange={(e) => updateQuantite(idx, e.target.value)}
                      />
                      <div className="qty-dispo">
                        Dispo: {ligne.stock_dispo}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {(ligne.prix_unitaire * ligne.quantite).toFixed(2)} DH
                    </td>
                    <td>
                      <button
                        type="button"
                        className="remove-line-btn"
                        onClick={() => removeLigne(idx)}
                      >
                        <LuX size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="vente-total-box">
            <span className="vente-total-label">Total</span>
            <span className="vente-total-value">
              {total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
            </span>
          </div>
        </>
      ) : (
        <div className="empty-state" style={{ marginBottom: '1.25rem' }}>
          <div className="empty-state-icon">
            <LuShoppingCart size={40} />
          </div>
          <p className="empty-state-text">
            Recherchez et ajoutez des médicaments à la vente
          </p>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Annuler
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || lignes.length === 0}
        >
          <LuShoppingCart size={16} />
          {submitting ? 'Création...' : 'Valider la vente'}
        </button>
      </div>
    </form>
  );
};

export default VenteForm;
