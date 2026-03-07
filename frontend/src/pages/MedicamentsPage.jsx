import { useState } from 'react';
import { LuPlus, LuPill } from 'react-icons/lu';
import toast from 'react-hot-toast';
import useMedicaments from '../hooks/useMedicaments';
import MedicamentFilters from '../components/medicaments/MedicamentFilters';
import MedicamentList from '../components/medicaments/MedicamentList';
import MedicamentForm from '../components/medicaments/MedicamentForm';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { createMedicament, updateMedicament, deleteMedicament } from '../api/medicamentsApi';

const MedicamentsPage = () => {
  const { data, loading, error, refetch, filters, setFilters } = useMedicaments({ page: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const medicaments = data?.results || [];
  const totalPages = data?.total_pages || 1;
  const currentPage = filters.page || 1;

  const handleCreate = () => {
    setEditingMed(null);
    setShowModal(true);
  };

  const handleEdit = (med) => {
    setEditingMed(med);
    setShowModal(true);
  };

  const handleDelete = (med) => {
    setConfirmDelete(med);
  };

  const handleFormSubmit = async (payload) => {
    if (editingMed) {
      await updateMedicament(editingMed.id, payload);
      toast.success(`"${payload.nom}" modifié avec succès`);
    } else {
      await createMedicament(payload);
      toast.success(`"${payload.nom}" ajouté avec succès`);
    }
    setShowModal(false);
    setEditingMed(null);
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteMedicament(confirmDelete.id);
      toast.success(`"${confirmDelete.nom}" supprimé`);
      setConfirmDelete(null);
      refetch();
    } catch (err) {
      toast.error(
        err.response?.data?.detail || 'Erreur lors de la suppression'
      );
      setConfirmDelete(null);
    }
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>
            <LuPill size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary-600)' }} />
            Médicaments
          </h2>
          <p className="page-header-subtitle">
            {data?.count ?? 0} médicament{(data?.count ?? 0) > 1 ? 's' : ''} enregistré{(data?.count ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleCreate}>
            <LuPlus size={16} /> Ajouter
          </button>
        </div>
      </div>

      <MedicamentFilters filters={filters} onFiltersChange={setFilters} />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <MedicamentList
            medicaments={medicaments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {showModal && (
        <Modal
          title={editingMed ? 'Modifier le médicament' : 'Ajouter un médicament'}
          onClose={() => {
            setShowModal(false);
            setEditingMed(null);
          }}
        >
          <MedicamentForm
            initialData={editingMed}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowModal(false);
              setEditingMed(null);
            }}
          />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Supprimer le médicament"
          message={`Êtes-vous sûr de vouloir supprimer "${confirmDelete.nom}" ? Cette action est irréversible.`}
          variant="danger"
          confirmText="Supprimer"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default MedicamentsPage;
