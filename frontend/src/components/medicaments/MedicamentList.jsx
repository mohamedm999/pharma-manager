import React from 'react';

const MedicamentList = ({ medicaments, onEdit, onDelete }) => {
  if (!medicaments || medicaments.length === 0) {
    return <p style={styles.empty}>Aucun médicament trouvé.</p>;
  }

  const getStockStatusStyle = (med) => {
    if (med.stock_actuel === 0) return styles.stockZero;
    if (med.est_en_alerte) return styles.stockAlerte;
    return styles.stockOk;
  };

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nom</th>
            <th style={styles.th}>Catégorie</th>
            <th style={styles.th}>Prix (Vente)</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map(med => (
            <tr key={med.id} style={styles.tr}>
              <td style={styles.td}>
                <strong>{med.nom}</strong>
                <div style={styles.subtext}>{med.dci || ''} - {med.dosage || ''}</div>
              </td>
              <td style={styles.td}>{med.categorie_nom}</td>
              <td style={styles.td}>{med.prix_vente} €</td>
              <td style={styles.td}>
                <span style={{...styles.badge, ...getStockStatusStyle(med)}}>
                  {med.stock_actuel} (Min: {med.stock_minimum})
                </span>
              </td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => onEdit(med)}>Modifier</button>
                <button style={styles.deleteBtn} onClick={() => onDelete(med.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  empty: {
    textAlign: 'center',
    padding: '2rem',
    color: '#666',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
  },
  tableContainer: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f3f4f6',
    padding: '1rem',
    textAlign: 'left',
    color: '#374151',
    fontWeight: '600',
    borderBottom: '2px solid #e5e7eb',
  },
  tr: {
    borderBottom: '1px solid #e5e7eb',
    transition: 'background-color 0.2s',
  },
  td: {
    padding: '1rem',
    verticalAlign: 'middle',
  },
  subtext: {
    fontSize: '0.85rem',
    color: '#6b7280',
    marginTop: '0.25rem',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  stockOk: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  stockAlerte: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  stockZero: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  editBtn: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '0.5rem',
    fontSize: '0.85rem',
  },
  deleteBtn: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  }
};

export default MedicamentList;
