import { useState, useMemo } from 'react';
import { LuPlus, LuFolderTree, LuSearch, LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import useCategories from '../hooks/useCategories';
import CategorieList from '../components/categories/CategorieList';
import CategorieForm from '../components/categories/CategorieForm';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { createCategorie, updateCategorie, deleteCategorie } from '../api/categoriesApi';

const CategoriesPage = () => {
  const { data, loading, error, refetch } = useCategories();
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Categories endpoint returns a flat array (no pagination)
  const categories = Array.isArray(data) ? data : [];

  // Client-side search filtering
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (cat) =>
        cat.nom.toLowerCase().includes(q) ||
        (cat.description && cat.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  const handleCreate = () => {
    setEditingCat(null);
    setShowModal(true);
  };

  const handleEdit = (cat) => {
    setEditingCat(cat);
    setShowModal(true);
  };

  const handleDelete = (cat) => {
    setConfirmDelete(cat);
  };

  const handleFormSubmit = async (payload) => {
    if (editingCat) {
      await updateCategorie(editingCat.id, payload);
      toast.success(`Catégorie "${payload.nom}" modifiée avec succès`);
    } else {
      await createCategorie(payload);
      toast.success(`Catégorie "${payload.nom}" ajoutée avec succès`);
    }
    setShowModal(false);
    setEditingCat(null);
    refetch();
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteCategorie(confirmDelete.id);
      toast.success(`Catégorie "${confirmDelete.nom}" supprimée`);
      setConfirmDelete(null);
      refetch();
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (err.response?.status === 500 || err.response?.status === 400) {
        // PROTECT constraint — medicaments are linked
        toast.error(
          detail ||
            `Impossible de supprimer "${confirmDelete.nom}" : des médicaments y sont associés.`
        );
      } else {
        toast.error(detail || 'Erreur lors de la suppression');
      }
      setConfirmDelete(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>
            <LuFolderTree
              size={24}
              style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary-600)' }}
            />
            Catégories
          </h2>
          <p className="page-header-subtitle">
            {categories.length} catégorie{categories.length > 1 ? 's' : ''} enregistrée
            {categories.length > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-primary" onClick={handleCreate}>
            <LuPlus size={16} /> Ajouter
          </button>
        </div>
      </div>

      {/* Search bar */}
      {!loading && !error && categories.length > 0 && (
        <div className="filters-bar">
          <div className="filter-search">
            <LuSearch className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Rechercher une catégorie…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-btn" onClick={() => setSearchQuery('')}>
                <LuX size={12} />
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          {searchQuery && (
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginBottom: '1rem' }}>
              {filteredCategories.length} résultat{filteredCategories.length > 1 ? 's' : ''} pour « {searchQuery} »
            </p>
          )}
          <CategorieList categories={filteredCategories} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      )}

      {showModal && (
        <Modal
          title={editingCat ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          onClose={() => {
            setShowModal(false);
            setEditingCat(null);
          }}
        >
          <CategorieForm
            categorie={editingCat}
            onSubmit={handleFormSubmit}
            onClose={() => {
              setShowModal(false);
              setEditingCat(null);
            }}
          />
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Supprimer la catégorie"
          message={`Êtes-vous sûr de vouloir supprimer la catégorie "${confirmDelete.nom}" ? Cette action est irréversible. La suppression échouera si des médicaments sont liés à cette catégorie.`}
          variant="danger"
          confirmLabel="Supprimer"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
};

export default CategoriesPage;
