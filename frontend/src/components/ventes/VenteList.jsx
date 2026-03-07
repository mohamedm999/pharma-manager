import { LuEye, LuCircleX, LuShoppingBag } from 'react-icons/lu';

const statusConfig = {
  COMPLETEE: { label: 'Complétée', badge: 'badge-success' },
  ANNULEE: { label: 'Annulée', badge: 'badge-danger' },
  EN_COURS: { label: 'En cours', badge: 'badge-warning' },
};

const VenteList = ({ ventes, onViewDetail, onCancel }) => {
  if (!ventes || ventes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><LuShoppingBag size={48} /></div>
        <p className="empty-state-text">Aucune vente trouvée</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Date</th>
            <th>Nb articles</th>
            <th>Total TTC</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ventes.map((vente) => {
            const status = statusConfig[vente.statut] || {
              label: vente.statut,
              badge: 'badge-info',
            };
            return (
              <tr key={vente.id}>
                <td style={{ fontWeight: 600 }}>{vente.reference || `#${vente.id}`}</td>
                <td>
                  {new Date(vente.date_vente).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>
                  {vente.lignes?.length ?? '—'}
                </td>
                <td style={{ fontWeight: 700 }}>
                  {Number(vente.total_ttc).toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  DH
                </td>
                <td>
                  <span className={`badge ${status.badge}`}>
                    {status.label}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onViewDetail(vente.id)}
                      title="Voir les détails"
                    >
                      <LuEye size={15} />
                    </button>
                    {vente.statut === 'COMPLETEE' && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onCancel(vente)}
                        title="Annuler la vente"
                        style={{ padding: '0.4rem 0.6rem' }}
                      >
                        <LuCircleX size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VenteList;
