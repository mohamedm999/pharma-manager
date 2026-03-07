import React, { useState } from 'react';
import useVentes from '../hooks/useVentes';
import { createVente } from '../api/ventesApi';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';

import VenteForm from '../components/ventes/VenteForm';

const VentesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pour l'instant on initialise juste pour vérifier si la page tourne.
  // On complètera la liste plus tard.
  const { refetch } = useVentes();

  const handleCreateVente = async (payload) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createVente(payload);
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      setSubmitError(err.response?.data?.detail || "Erreur lors de la création de la vente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Gestion des Ventes</h2>
        <button style={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          + Nouvelle Vente
        </button>
      </header>

      <div style={styles.placeholderContainer}>
        <p>L'historique des ventes sera implémenté dans le prochain commit.</p>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isSubmitting && setIsModalOpen(false)}
        title="Nouvelle Vente"
      >
        {submitError && <ErrorMessage message={submitError} />}
        <VenteForm 
          onSubmit={handleCreateVente}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

const styles = {
  page: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  addBtn: { backgroundColor: '#3b82f6', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
  placeholderContainer: { padding: '3rem', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px dashed #d1d5db', color: '#6b7280' }
};

export default VentesPage;
