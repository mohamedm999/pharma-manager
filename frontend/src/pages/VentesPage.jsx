import React, { useState } from 'react';
import useVentes from '../hooks/useVentes';
import { createVente, annulerVente } from '../api/ventesApi';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';

import VenteForm from '../components/ventes/VenteForm';
import VenteList from '../components/ventes/VenteList';
import VenteDetail from '../components/ventes/VenteDetail';

const VentesPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVente, setSelectedVente] = useState(null);
  
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error, refetch, setFilters } = useVentes({ page: 1 });

  const handleFilterDate = () => {
    setCurrentPage(1);
    setFilters({ page: 1, date_debut: dateDebut, date_fin: dateFin });
  };

  const handleClearFilters = () => {
    setDateDebut('');
    setDateFin('');
    setCurrentPage(1);
    setFilters({ page: 1 });
  };

  const handleCreateVente = async (payload) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createVente(payload);
      setIsFormModalOpen(false);
      refetch();
    } catch (err) {
      setSubmitError(err.response?.data?.detail || "Erreur lors de la création de la vente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetail = (vente) => {
    setSelectedVente(vente);
    setIsDetailModalOpen(true);
  };

  const handleCancelVente = async (vente) => {
    if (window.confirm(`Êtes-vous sûr de vouloir annuler la vente ${vente.reference} ? Le stock sera réintégré.`)) {
      try {
        await annulerVente(vente.id);
        refetch();
        // Si le modal de détail est ouvert pour cette vente, on le met à jour ou on le ferme
        if (isDetailModalOpen && selectedVente?.id === vente.id) {
            setIsDetailModalOpen(false);
        }
      } catch (err) {
        alert(err.response?.data?.detail || "Erreur lors de l'annulation.");
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilters(prev => ({ ...prev, page }));
  };

  const results = data?.results || [];
  const totalCount = data?.count || 0;
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Historique des Ventes</h2>
        <button style={styles.addBtn} onClick={() => setIsFormModalOpen(true)}>
          + Nouvelle Vente
        </button>
      </header>

      {/* Barre de filtres par date */}
      <div style={styles.filtersContainer}>
        <div style={styles.dateGroup}>
          <label style={styles.dateLabel}>Du :</label>
          <input 
            type="date" 
            style={styles.dateInput} 
            value={dateDebut} 
            onChange={(e) => setDateDebut(e.target.value)} 
          />
        </div>
        <div style={styles.dateGroup}>
          <label style={styles.dateLabel}>Au :</label>
          <input 
            type="date" 
            style={styles.dateInput} 
            value={dateFin} 
            onChange={(e) => setDateFin(e.target.value)} 
          />
        </div>
        <button style={styles.filterBtn} onClick={handleFilterDate}>Filtrer</button>
        {(dateDebut || dateFin) && (
          <button style={styles.clearBtn} onClick={handleClearFilters}>Effacer</button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <VenteList 
            ventes={results} 
            onViewDetail={handleViewDetail}
            onCancelVente={handleCancelVente}
          />
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
        </>
      )}

      {/* Modal Création Vente */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => !isSubmitting && setIsFormModalOpen(false)}
        title="Nouvelle Vente"
      >
        {submitError && <ErrorMessage message={submitError} />}
        <VenteForm 
          onSubmit={handleCreateVente}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal Détails Vente */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Détails de la Vente"
      >
        <VenteDetail vente={selectedVente} />
      </Modal>

    </div>
  );
};

const styles = {
  page: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  addBtn: { backgroundColor: '#3b82f6', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
  filtersContainer: { display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' },
  dateGroup: { display: 'flex', flexDirection: 'column', gap: '0.25rem' },
  dateLabel: { fontSize: '0.85rem', fontWeight: 'bold', color: '#4b5563' },
  dateInput: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none' },
  filterBtn: { padding: '0.5rem 1.5rem', backgroundColor: '#4b5563', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '38px' },
  clearBtn: { padding: '0.5rem 1.5rem', backgroundColor: '#e5e7eb', color: '#4b5563', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', height: '38px' }
};

export default VentesPage;
