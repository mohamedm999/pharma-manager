import React, { useState } from 'react';
import useMedicaments from '../hooks/useMedicaments';
import useCategories from '../hooks/useCategories';
import { createMedicament, updateMedicament, deleteMedicament } from '../api/medicamentsApi';

import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';

import MedicamentList from '../components/medicaments/MedicamentList';
import MedicamentForm from '../components/medicaments/MedicamentForm';
import MedicamentFilters from '../components/medicaments/MedicamentFilters';

const MedicamentsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicament, setSelectedMedicament] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    data: categoriesData 
  } = useCategories();

  const { 
    data: medicamentsData, 
    loading: medicamentsLoading, 
    error: medicamentsError, 
    filters,
    setFilters,
    refetch 
  } = useMedicaments({ page: 1 });

  // Gestion des filtres
  const handleSearch = (searchTerm) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleCategoryChange = (categoryId) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, categorie: categoryId, page: 1 }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setFilters(prev => ({ ...prev, page }));
  };

  // Actions d'interface
  const handleAddClick = () => {
    setSelectedMedicament(null);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (medicament) => {
    setSelectedMedicament(medicament);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?")) {
      try {
        await deleteMedicament(id);
        refetch();
      } catch (err) {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (selectedMedicament) {
        await updateMedicament(selectedMedicament.id, formData);
      } else {
        await createMedicament(formData);
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      const apiErrors = err.response?.data;
      if (apiErrors && typeof apiErrors === 'object') {
        const messages = Object.entries(apiErrors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join(' | ');
        setSubmitError(messages);
      } else {
        setSubmitError("Erreur lors de l'enregistrement. Vérifiez vos données.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Extraction de la pagination enrichie DRF
  const results = medicamentsData?.results || [];
  const totalPages = medicamentsData?.total_pages || 1;
  // const backendCurrentPage = medicamentsData?.current_page; // available for use

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Gestion des Médicaments</h2>
        <button style={styles.addBtn} onClick={handleAddClick}>
          + Ajouter un Médicament
        </button>
      </header>

      <MedicamentFilters 
        categories={categoriesData} 
        onSearch={handleSearch}
        selectedCategory={filters.categorie}
        onCategoryChange={handleCategoryChange}
      />

      {medicamentsError && <ErrorMessage message={medicamentsError} />}

      {medicamentsLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <MedicamentList 
            medicaments={results} 
            onEdit={handleEditClick} 
            onDelete={handleDeleteClick} 
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedMedicament ? "Modifier le médicament" : "Ajouter un médicament"}
      >
        {submitError && <ErrorMessage message={submitError} />}
        <MedicamentForm 
          initialData={selectedMedicament}
          categories={categoriesData}
          onSubmit={handleFormSubmit}
          isLoading={isSubmitting}
        />
      </Modal>
      
    </div>
  );
};

const styles = {
  page: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
  addBtn: { backgroundColor: '#10b981', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }
};

export default MedicamentsPage;
