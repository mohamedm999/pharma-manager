import { useState, useEffect } from 'react';
import { LuPill, LuTriangleAlert, LuShoppingCart, LuDollarSign, LuTrendingUp, LuPackage } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { fetchDashboardMetrics } from '../api/dashboardApi';
import { fetchAlertes } from '../api/medicamentsApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchDashboardMetrics();
        setMetrics(data);

        // Show stock alert toast if there are medicines in alert
        if (data.medicaments_alerte > 0) {
          toast(
            `⚠️ ${data.medicaments_alerte} médicament${data.medicaments_alerte > 1 ? 's' : ''} en alerte de stock !`,
            {
              icon: '🔔',
              duration: 6000,
              style: {
                border: '1px solid var(--warning-100)',
                background: 'var(--warning-50)',
                color: 'var(--warning-700)',
                fontWeight: 600,
              },
            }
          );
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Erreur lors du chargement du tableau de bord');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Also load alertes to show recent ones
  const [alertes, setAlertes] = useState([]);

  useEffect(() => {
    const loadAlertes = async () => {
      try {
        const data = await fetchAlertes();
        setAlertes(data.results || data || []);
      } catch {
        // Silent fail for alertes sidebar
      }
    };
    loadAlertes();
  }, []);

  if (loading) return <LoadingSpinner text="Chargement du tableau de bord..." />;
  if (error) return <div className="page"><ErrorMessage message={error} /></div>;
  if (!metrics) return null;

  const stats = [
    {
      label: 'Total Médicaments',
      value: metrics.total_medicaments ?? 0,
      icon: LuPill,
      color: 'stat-blue',
    },
    {
      label: 'En alerte stock',
      value: metrics.medicaments_alerte ?? 0,
      icon: LuTriangleAlert,
      color: 'stat-red',
      isAlert: (metrics.medicaments_alerte ?? 0) > 0,
    },
    {
      label: 'Ventes du jour',
      value: metrics.ventes_jour ?? 0,
      icon: LuShoppingCart,
      color: 'stat-amber',
    },
    {
      label: "CA du jour",
      value: `${Number(metrics.chiffre_affaires_jour ?? 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH`,
      icon: LuDollarSign,
      color: 'stat-green',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Tableau de bord</h2>
          <p className="page-header-subtitle">Vue d'ensemble de votre pharmacie</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-label">{stat.label}</div>
              <div className={`stat-value ${stat.isAlert ? 'has-alert' : ''}`}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Alert List */}
      {alertes.length > 0 && (
        <div className="table-container" style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '1.25rem 1.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LuTriangleAlert size={20} style={{ color: 'var(--danger-500)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', margin: 0 }}>
              Médicaments en alerte de stock
            </h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>DCI</th>
                <th>Stock actuel</th>
                <th>Seuil d'alerte</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {alertes.slice(0, 10).map((med) => (
                <tr key={med.id}>
                  <td style={{ fontWeight: 600 }}>{med.nom}</td>
                  <td style={{ color: 'var(--gray-500)' }}>{med.dci || '—'}</td>
                  <td>
                    <span className="badge badge-danger">{med.stock_actuel}</span>
                  </td>
                  <td>{med.stock_minimum}</td>
                  <td>
                    <span className="badge badge-warning">
                      <LuTriangleAlert size={12} /> Stock bas
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
