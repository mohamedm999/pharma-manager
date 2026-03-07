import React from 'react';

const VenteList = ({ ventes, onViewDetail, onCancelVente }) => {
  if (!ventes || ventes.length === 0) {
    return <p style={styles.empty}>Aucune vente trouvée.</p>;
  }

  const getStatusStyle = (statut) => {
    switch (statut) {
      case 'COMPLETEE': return styles.statusCompletee;
      case 'ANNULEE': return styles.statusAnnulee;
      case 'EN_COURS': return styles.statusEnCours;
      default: return {};
    }
  };

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Référence</th>
            <th style={styles.th}>Statut</th>
            <th style={styles.th}>Total TTC</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ventes.map(vente => (
            <tr key={vente.id} style={styles.tr}>
              <td style={styles.td}>
                {new Date(vente.date_vente).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </td>
              <td style={styles.td}><strong>{vente.reference}</strong></td>
              <td style={styles.td}>
                <span style={{...styles.badge, ...getStatusStyle(vente.statut)}}>
                  {vente.statut}
                </span>
              </td>
              <td style={styles.td}><strong>{vente.total_ttc} €</strong></td>
              <td style={styles.td}>
                <button style={styles.viewBtn} onClick={() => onViewDetail(vente)}>Détails</button>
                {vente.statut !== 'ANNULEE' && (
                  <button style={styles.cancelBtn} onClick={() => onCancelVente(vente)}>Annuler</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  empty: { textAlign: 'center', padding: '2rem', color: '#666', backgroundColor: '#f9fafb', borderRadius: '8px' },
  tableContainer: { overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#f3f4f6', padding: '1rem', textAlign: 'left', color: '#374151', fontWeight: '600', borderBottom: '2px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' },
  td: { padding: '1rem', verticalAlign: 'middle' },
  badge: { display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '500' },
  statusCompletee: { backgroundColor: '#d1fae5', color: '#065f46' },
  statusAnnulee: { backgroundColor: '#fee2e2', color: '#991b1b' },
  statusEnCours: { backgroundColor: '#dbeafe', color: '#1e40af' },
  viewBtn: { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.85rem' },
  cancelBtn: { backgroundColor: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
};

export default VenteList;
