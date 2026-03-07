import React, { useState, useEffect } from 'react';
import { fetchDashboardMetrics } from '../api/dashboardApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const DashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const data = await fetchDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        setError(err.response?.data?.detail || err.message || 'Erreur lors du chargement des statistiques.');
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) return <div style={styles.page}><LoadingSpinner /></div>;
  if (error) return <div style={styles.page}><ErrorMessage message={error} /></div>;
  if (!metrics) return null;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Tableau de Bord</h2>
        <p style={styles.subtitle}>Aperçu de l'activité du jour</p>
      </header>

      <div style={styles.grid}>
        
        {/* Carte 1 : Médicaments Actifs */}
        <div style={{...styles.card, borderLeftColor: '#3b82f6'}}>
          <h3 style={styles.cardTitle}>Médicaments Actifs</h3>
          <div style={styles.cardValue}>{metrics.total_medicaments}</div>
          <div style={styles.cardIcon}>💊</div>
        </div>

        {/* Carte 2 : Alertes Stock */}
        <div style={{...styles.card, borderLeftColor: '#ef4444'}}>
          <h3 style={styles.cardTitle}>Alerte Stock</h3>
          <div style={{...styles.cardValue, color: metrics.medicaments_alerte > 0 ? '#ef4444' : '#111827'}}>
            {metrics.medicaments_alerte}
          </div>
          <div style={styles.cardIcon}>⚠️</div>
        </div>

        {/* Carte 3 : Ventes du jour */}
        <div style={{...styles.card, borderLeftColor: '#f59e0b'}}>
          <h3 style={styles.cardTitle}>Ventes du Jour</h3>
          <div style={styles.cardValue}>{metrics.ventes_jour}</div>
          <div style={styles.cardIcon}>🛒</div>
        </div>

        {/* Carte 4 : Chiffre d'Affaires */}
        <div style={{...styles.card, borderLeftColor: '#10b981'}}>
          <h3 style={styles.cardTitle}>Montant Total (Aujourd'hui)</h3>
          <div style={{...styles.cardValue, color: '#10b981'}}>
            {metrics.chiffre_affaires_jour.toFixed(2)} €
          </div>
          <div style={styles.cardIcon}>💶</div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { marginBottom: '2rem' },
  subtitle: { color: '#6b7280', marginTop: '0.25rem' },
  grid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
    gap: '1.5rem' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: '1.5rem', 
    borderRadius: '8px', 
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #ccc',
    position: 'relative'
  },
  cardTitle: { fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 'bold' },
  cardValue: { fontSize: '2.5rem', fontWeight: '900', color: '#111827' },
  cardIcon: { position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '2rem', opacity: '0.2' }
};

export default DashboardPage;
