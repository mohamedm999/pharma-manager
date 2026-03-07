import { LuPencil, LuTrash2, LuTriangleAlert, LuPackage } from 'react-icons/lu';

const MedicamentList = ({ medicaments, onEdit, onDelete }) => {
  if (!medicaments || medicaments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><LuPackage size={48} /></div>
        <p className="empty-state-text">Aucun médicament trouvé</p>
      </div>
    );
  }

  const getStockBadge = (med) => {
    if (med.est_en_alerte) {
      return (
        <span className="badge badge-danger">
          <LuTriangleAlert size={12} /> {med.stock_actuel}
        </span>
      );
    }
    if (med.stock_actuel <= (med.stock_minimum || 10) * 1.5) {
      return <span className="badge badge-warning">{med.stock_actuel}</span>;
    }
    return <span className="badge badge-success">{med.stock_actuel}</span>;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Médicament</th>
            <th>Catégorie</th>
            <th>Forme / Dosage</th>
            <th>Prix vente</th>
            <th>Stock</th>
            <th>Expiration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicaments.map((med) => (
            <tr key={med.id}>
              <td>
                <div style={{ fontWeight: 600 }}>{med.nom}</div>
                {med.dci && <div className="table-subtext">{med.dci}</div>}
              </td>
              <td>
                {med.categorie_nom ? (
                  <span className="badge badge-info">{med.categorie_nom}</span>
                ) : (
                  <span style={{ color: 'var(--gray-400)' }}>—</span>
                )}
              </td>
              <td>
                <div>{med.forme || '—'}</div>
                {med.dosage && <div className="table-subtext">{med.dosage}</div>}
              </td>
              <td style={{ fontWeight: 600 }}>
                {Number(med.prix_vente).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH
              </td>
              <td>{getStockBadge(med)}</td>
              <td>
                {med.date_expiration ? (
                  <span style={{ 
                    color: new Date(med.date_expiration) < new Date() ? 'var(--danger-500)' : 'var(--gray-600)',
                    fontWeight: new Date(med.date_expiration) < new Date() ? 600 : 400
                  }}>
                    {new Date(med.date_expiration).toLocaleDateString('fr-FR')}
                  </span>
                ) : '—'}
              </td>
              <td>
                <div className="table-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => onEdit(med)}
                    title="Modifier"
                  >
                    <LuPencil size={15} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(med)}
                    title="Supprimer"
                    style={{ padding: '0.4rem 0.6rem' }}
                  >
                    <LuTrash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicamentList;
