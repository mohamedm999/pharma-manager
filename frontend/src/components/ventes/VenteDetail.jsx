import { useState, useEffect } from 'react';
import { LuArrowLeft } from 'react-icons/lu';
import { fetchVenteDetail } from '../../api/ventesApi';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const statusConfig = {
  COMPLETEE: { label: 'Complétée', badge: 'badge-success' },
  ANNULEE: { label: 'Annulée', badge: 'badge-danger' },
  EN_COURS: { label: 'En cours', badge: 'badge-warning' },
};

const VenteDetail = ({ venteId, onBack }) => {
  const [vente, setVente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchVenteDetail(venteId);
        setVente(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            err.message ||
            'Erreur lors du chargement'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [venteId]);

  if (loading) return <LoadingSpinner text="Chargement de la vente..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!vente) return null;

  const status = statusConfig[vente.statut] || {
    label: vente.statut,
    badge: 'badge-info',
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <button
        className="btn btn-ghost"
        onClick={onBack}
        style={{ marginBottom: '1.25rem' }}
      >
        <LuArrowLeft size={16} /> Retour aux ventes
      </button>

      <div className="vente-detail-header" style={{ marginBottom: '1.5rem' }}>
        <div className="vente-detail-field">
          <span className="vente-detail-field-label">Référence</span>
          <span className="vente-detail-field-value">{vente.reference}</span>
        </div>
        <div className="vente-detail-field">
          <span className="vente-detail-field-label">Date</span>
          <span className="vente-detail-field-value">
            {new Date(vente.date_vente).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <div className="vente-detail-field">
          <span className="vente-detail-field-label">Statut</span>
          <span className={`badge ${status.badge}`}>{status.label}</span>
        </div>
        <div className="vente-detail-field">
          <span className="vente-detail-field-label">Total</span>
          <span
            className="vente-detail-field-value"
            style={{ fontWeight: 800, color: 'var(--success-700)' }}
          >
            {Number(vente.total_ttc).toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
            })}{' '}
            DH
          </span>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Médicament</th>
              <th>Prix unitaire</th>
              <th>Quantité</th>
              <th>Sous-total</th>
            </tr>
          </thead>
          <tbody>
            {(vente.lignes || []).map((ligne, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600 }}>
                  {ligne.medicament_nom || `Médicament #${ligne.medicament}`}
                </td>
                <td>
                  {Number(ligne.prix_unitaire).toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                  })}{' '}
                  DH
                </td>
                <td>{ligne.quantite}</td>
                <td style={{ fontWeight: 600 }}>
                  {(
                    Number(ligne.prix_unitaire) * ligne.quantite
                  ).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}{' '}
                  DH
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan={3}
                style={{
                  textAlign: 'right',
                  fontWeight: 700,
                  paddingRight: '1rem',
                  background: 'var(--gray-50)',
                }}
              >
                Total
              </td>
              <td
                style={{
                  fontWeight: 800,
                  color: 'var(--success-700)',
                  fontSize: '1.1rem',
                  background: 'var(--gray-50)',
                }}
              >
                {Number(vente.total_ttc).toLocaleString('fr-FR', {
                  minimumFractionDigits: 2,
                })}{' '}
                DH
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default VenteDetail;
