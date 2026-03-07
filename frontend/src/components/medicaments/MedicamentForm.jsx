import React, { useState, useEffect } from 'react';

const MedicamentForm = ({ initialData, categories, onSubmit, isLoading }) => {
  const defaultState = {
    nom: '', dci: '', categorie: '', forme: '', dosage: '', 
    prix_achat: '', prix_vente: '', stock_actuel: 0, 
    stock_minimum: 10, date_expiration: '', ordonnance_requise: false
  };

  const [formData, setFormData] = useState(defaultState);

  useEffect(() => {
    if (initialData) {
      // Ne garder que les champs éditables, exclure les champs read-only du backend
      const { id, est_en_alerte, categorie_nom, date_creation, ...editableData } = initialData;
      setFormData({ ...defaultState, ...editableData });
    } else {
      setFormData(defaultState);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      
      <div style={styles.row}>
        <div style={styles.group}>
          <label style={styles.label}>Nom *</label>
          <input required style={styles.input} name="nom" value={formData.nom} onChange={handleChange} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Catégorie *</label>
          <select required style={styles.input} name="categorie" value={formData.categorie} onChange={handleChange}>
            <option value="">Sélectionner...</option>
            {categories && categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.group}>
          <label style={styles.label}>DCI</label>
          <input style={styles.input} name="dci" value={formData.dci || ''} onChange={handleChange} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Forme (ex: Comprimé)</label>
          <input style={styles.input} name="forme" value={formData.forme || ''} onChange={handleChange} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Dosage (ex: 500mg)</label>
          <input style={styles.input} name="dosage" value={formData.dosage || ''} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.group}>
          <label style={styles.label}>Prix Achat (€) *</label>
          <input required type="number" step="0.01" style={styles.input} name="prix_achat" value={formData.prix_achat} onChange={handleChange} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Prix Vente (€) *</label>
          <input required type="number" step="0.01" style={styles.input} name="prix_vente" value={formData.prix_vente} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.group}>
          <label style={styles.label}>Stock actuel *</label>
          <input required type="number" min="0" style={styles.input} name="stock_actuel" value={formData.stock_actuel} onChange={handleChange} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Stock min *</label>
          <input required type="number" min="0" style={styles.input} name="stock_minimum" value={formData.stock_minimum} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.group}>
          <label style={styles.label}>Date Expiration</label>
          <input type="date" style={styles.input} name="date_expiration" value={formData.date_expiration?.split('T')[0] || ''} onChange={handleChange} />
        </div>
        <div style={{...styles.group, justifyContent: 'center'}}>
          <label style={styles.checkboxLabel}>
            <input type="checkbox" name="ordonnance_requise" checked={formData.ordonnance_requise} onChange={handleChange} style={styles.checkbox} />
            Ordonnance requise
          </label>
        </div>
      </div>

      <div style={styles.actions}>
        <button type="submit" disabled={isLoading} style={styles.submitBtn}>
          {isLoading ? 'Enregistrement...' : (initialData ? 'Mettre à jour' : 'Ajouter')}
        </button>
      </div>

    </form>
  );
};

const styles = {
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  group: { flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  label: { fontSize: '0.9rem', fontWeight: '500', color: '#374151' },
  input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none', fontSize: '1rem' },
  checkboxLabel: { display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '500', color: '#374151', height: '100%' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  actions: { marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' },
  submitBtn: { padding: '0.75rem 1.5rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }
};

export default MedicamentForm;
