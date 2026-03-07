import React from 'react';

const VenteDetail = ({ vente }) => {
  if (!vente) return null;

  return (
    <div style={styles.container}>
      <div style={styles.headerInfo}>
        <div style={styles.infoBlock}>
          <span style={styles.label}>Référence :</span>
          <span style={styles.value}>{vente.reference}</span>
        </div>
        <div style={styles.infoBlock}>
          <span style={styles.label}>Date :</span>
          <span style={styles.value}>{new Date(vente.date_vente).toLocaleString('fr-FR')}</span>
        </div>
        <div style={styles.infoBlock}>
          <span style={styles.label}>Statut :</span>
          <span style={{...styles.badge, ...getStatusStyle(vente.statut)}}>{vente.statut}</span>
        </div>
        {vente.notes && (
          <div style={{...styles.infoBlock, width: '100%'}}>
            <span style={styles.label}>Notes :</span>
            <span style={styles.value}>{vente.notes}</span>
          </div>
        )}
      </div>

      <h4 style={styles.sectionTitle}>Lignes de la vente</h4>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Médicament</th>
              <th style={styles.th}>Quantité</th>
              <th style={styles.th}>Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {vente.lignes && vente.lignes.map(ligne => (
              <tr key={ligne.id} style={styles.tr}>
                <td style={styles.td}>{ligne.medicament_nom}</td>
                <td style={styles.td}>{ligne.quantite}</td>
                <td style={styles.td}>{ligne.sous_total} €</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" style={styles.tfootLabel}>Total TTC :</td>
              <td style={styles.tfootValue}>{vente.total_ttc} €</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const getStatusStyle = (statut) => {
  switch (statut) {
    case 'COMPLETEE': return { backgroundColor: '#d1fae5', color: '#065f46' };
    case 'ANNULEE': return { backgroundColor: '#fee2e2', color: '#991b1b' };
    case 'EN_COURS': return { backgroundColor: '#dbeafe', color: '#1e40af' };
    default: return { backgroundColor: '#f3f4f6', color: '#374151' };
  }
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  headerInfo: { display: 'flex', flexWrap: 'wrap', gap: '1rem', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' },
  infoBlock: { display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '150px' },
  label: { fontSize: '0.85rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' },
  value: { fontSize: '1rem', color: '#111827', fontWeight: '500' },
  badge: { display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '500', width: 'fit-content' },
  sectionTitle: { margin: 0, fontSize: '1.1rem', color: '#374151', borderBottom: '2px solid #e5e7eb', paddingBottom: '0.5rem' },
  tableContainer: { overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { backgroundColor: '#f9fafb', padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '0.9rem', color: '#6b7280' },
  tr: { borderBottom: '1px solid #e5e7eb' },
  td: { padding: '0.75rem', verticalAlign: 'middle', fontSize: '0.95rem' },
  tfootLabel: { padding: '1rem', textAlign: 'right', fontWeight: 'bold', backgroundColor: '#f9fafb' },
  tfootValue: { padding: '1rem', fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: '#f9fafb', color: '#15803d' }
};

export default VenteDetail;
