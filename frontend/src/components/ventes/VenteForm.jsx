import React, { useState, useEffect, useMemo } from 'react';
import useMedicaments from '../../hooks/useMedicaments';
import SearchBar from '../common/SearchBar';

const VenteForm = ({ onSubmit, isLoading }) => {
  const [lignes, setLignes] = useState([]);
  const [notes, setNotes] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Hook pour chercher des médicaments en direct
  const { data: medData, filters, setFilters } = useMedicaments({ page: 1, search: '' });
  const searchResults = useMemo(() => medData?.results || [], [medData]);

  const handleSearch = (term) => {
    setFilters(prev => ({ ...prev, search: term, page: 1 }));
  };

  const ajouterMedicament = (med) => {
    // Vérifier s'il est déjà dans la liste
    const exist = lignes.find(l => l.medicament.id === med.id);
    if (exist) {
      alert("Ce médicament est déjà dans la vente.");
      setSearchFocused(false);
      return;
    }
    
    if (med.stock_actuel <= 0) {
      alert("Stock épuisé pour ce médicament.");
      setSearchFocused(false);
      return;
    }

    setLignes([...lignes, {
      medicament: med,
      quantite: 1,
      prix_unitaire: parseFloat(med.prix_vente)
    }]);
    setSearchFocused(false);
  };

  const updateQuantite = (index, value) => {
    const qty = parseInt(value, 10);
    const newLignes = [...lignes];
    const med = newLignes[index].medicament;
    
    if (isNaN(qty) || qty < 1) {
      newLignes[index].quantite = 1;
    } else if (qty > med.stock_actuel) {
      alert(`Stock insuffisant. Le stock actuel est de ${med.stock_actuel}.`);
      newLignes[index].quantite = med.stock_actuel;
    } else {
      newLignes[index].quantite = qty;
    }
    
    setLignes(newLignes);
  };

  const removeLigne = (index) => {
    const newLignes = lignes.filter((_, i) => i !== index);
    setLignes(newLignes);
  };

  const totalTTC = React.useMemo(() => {
    return lignes.reduce((acc, ligne) => acc + (ligne.quantite * ligne.prix_unitaire), 0);
  }, [lignes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lignes.length === 0) {
      alert("Veuillez ajouter au moins un médicament.");
      return;
    }

    const payload = {
      notes,
      total_ttc: totalTTC.toFixed(2), // Backend ignore mais utile pour vérif
      lignes: lignes.map(l => ({
        medicament: l.medicament.id,
        quantite: l.quantite
      }))
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.formContainer}>
      
      {/* SECTION RECHERCHE */}
      <div style={styles.searchSection} onFocus={() => setSearchFocused(true)} onBlur={(e) => {
        // Delay blur to allow click on results
        if (!e.currentTarget.contains(e.relatedTarget)) {
           setTimeout(() => setSearchFocused(false), 200);
        }
      }} tabIndex="-1">
        <label style={styles.label}>Ajouter un médicament</label>
        <SearchBar 
          placeholder="Tapez le nom d'un médicament..." 
          onSearch={handleSearch}
          delay={300}
        />
        
        {searchFocused && (filters.search !== '') && searchResults.length > 0 && (
          <div style={styles.dropdown}>
            {searchResults.map(med => (
              <div 
                key={med.id} 
                style={styles.dropdownItem} 
                onClick={() => ajouterMedicament(med)}
              >
                <div>
                  <strong>{med.nom}</strong> <span style={{fontSize:'0.85em', color:'#666'}}>{med.dci}</span>
                </div>
                <div>
                  <span style={{marginRight:'1rem'}}>Stock: {med.stock_actuel}</span>
                  <span>Prix: {med.prix_vente} €</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION LIGNES */}
      <div style={styles.lignesSection}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Médicament</th>
              <th style={styles.th}>Prix Unitaire</th>
              <th style={styles.th}>Quantité</th>
              <th style={styles.th}>Sous-total</th>
              <th style={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {lignes.length === 0 ? (
              <tr><td colSpan="5" style={styles.emptyTable}>Aucun médicament ajouté</td></tr>
            ) : (
              lignes.map((ligne, i) => (
                <tr key={i} style={styles.tr}>
                  <td style={styles.td}>{ligne.medicament.nom}</td>
                  <td style={styles.td}>{ligne.prix_unitaire.toFixed(2)} €</td>
                  <td style={styles.td}>
                    <input 
                      type="number" 
                      min="1" 
                      max={ligne.medicament.stock_actuel}
                      value={ligne.quantite} 
                      onChange={(e) => updateQuantite(i, e.target.value)}
                      style={styles.qtyInput}
                    />
                    <div style={styles.stockInfo}>/ {ligne.medicament.stock_actuel} dispo</div>
                  </td>
                  <td style={styles.td}>{(ligne.quantite * ligne.prix_unitaire).toFixed(2)} €</td>
                  <td style={styles.td}>
                    <button type="button" onClick={() => removeLigne(i)} style={styles.removeBtn}>&times;</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SECTION TOTAL & NOTES */}
      <div style={styles.bottomSection}>
        <div style={styles.notesWrapper}>
          <label style={styles.label}>Notes (Optionnel)</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)}
            style={styles.textarea}
            rows="3"
          />
        </div>
        <div style={styles.totalWrapper}>
          <div style={styles.totalLabel}>Total TTC :</div>
          <div style={styles.totalValue}>{totalTTC.toFixed(2)} €</div>
        </div>
      </div>

      <div style={styles.actions}>
        <button type="submit" disabled={isLoading || lignes.length === 0} style={styles.submitBtn}>
          {isLoading ? 'Enregistrement...' : 'Valider la Vente'}
        </button>
      </div>
    </form>
  );
};

const styles = {
  formContainer: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  label: { display: 'block', fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' },
  searchSection: { position: 'relative', outline: 'none' },
  dropdown: { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', zIndex: 10, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  dropdownItem: { padding: '0.75rem', borderBottom: '1px solid #eee', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  lignesSection: { overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#f9fafb', padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '0.9rem', color: '#6b7280' },
  tr: { borderBottom: '1px solid #e5e7eb' },
  td: { padding: '0.75rem', verticalAlign: 'middle' },
  emptyTable: { textAlign: 'center', padding: '2rem', color: '#9ca3af' },
  qtyInput: { width: '60px', padding: '0.25rem', textAlign: 'center', border: '1px solid #d1d5db', borderRadius: '4px' },
  stockInfo: { fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' },
  removeBtn: { background: 'none', border: 'none', color: '#ef4444', fontSize: '1.25rem', cursor: 'pointer' },
  bottomSection: { display: 'flex', gap: '2rem', justifyContent: 'space-between', flexWrap: 'wrap' },
  notesWrapper: { flex: '1 1 300px' },
  textarea: { width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', resize: 'vertical' },
  totalWrapper: { flex: '0 0 250px', display: 'flex', flexDirection:'column', alignItems: 'flex-end', justifyContent: 'center', backgroundColor: '#f0fdf4', padding: '1rem', borderRadius: '8px', border: '1px solid #bbf7d0' },
  totalLabel: { fontSize: '1.1rem', color: '#166534', fontWeight: 'bold' },
  totalValue: { fontSize: '2rem', color: '#15803d', fontWeight: '900' },
  actions: { display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' },
  submitBtn: { backgroundColor: '#3b82f6', color: '#fff', padding: '0.75rem 2rem', fontSize: '1.1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};

export default VenteForm;
