import { useState } from 'react';
import { LuPlus, LuShoppingCart, LuFilter, LuDownload } from 'react-icons/lu';
import toast from 'react-hot-toast';
import useVentes from '../hooks/useVentes';
import VenteList from '../components/ventes/VenteList';
import VenteForm from '../components/ventes/VenteForm';
import VenteDetail from '../components/ventes/VenteDetail';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { createVente, annulerVente } from '../api/ventesApi';
import axiosInstance from '../api/axiosConfig';

const VentesPage = () => {
  const { data, loading, error, refetch, filters, setFilters } = useVentes({ page: 1 });
  const [showForm, setShowForm] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');

  const ventes = data?.results || [];
  const totalPages = data?.total_pages || 1;
  const currentPage = filters.page || 1;

  const handleCreateVente = async (payload) => {
    await createVente(payload);
    toast.success('Vente créée avec succès !');
    setShowForm(false);
    refetch();
  };

  const handleCancelVente = (vente) => {
    setConfirmCancel(vente);
  };

  const handleConfirmCancel = async () => {
    if (!confirmCancel) return;
    try {
      await annulerVente(confirmCancel.id);
      toast.success(`Vente ${confirmCancel.reference || '#' + confirmCancel.id} annulée`);
      setConfirmCancel(null);
      refetch();
    } catch (err) {
      toast.error(
        err.response?.data?.detail || 'Erreur lors de l\'annulation'
      );
      setConfirmCancel(null);
    }
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDateFilter = () => {
    const newFilters = { ...filters, page: 1 };
    if (dateDebut) newFilters.date_debut = dateDebut;
    else delete newFilters.date_debut;
    if (dateFin) newFilters.date_fin = dateFin;
    else delete newFilters.date_fin;
    setFilters(newFilters);
  };

  const clearDateFilter = () => {
    setDateDebut('');
    setDateFin('');
    const newFilters = { ...filters, page: 1 };
    delete newFilters.date_debut;
    delete newFilters.date_fin;
    setFilters(newFilters);
  };

  const handleExportCSV = async () => {
    try {
      const response = await axiosInstance.get('/ventes/export_csv/', {
        responseType: 'blob',
        params: { date_debut: dateDebut || undefined, date_fin: dateFin || undefined },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ventes_export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Export CSV téléchargé');
    } catch {
      toast.error("Erreur lors de l'export CSV");
    }
  };

  // If viewing detail
  if (detailId) {
    return (
      <div className="page">
        <VenteDetail venteId={detailId} onBack={() => setDetailId(null)} />
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>
            <LuShoppingCart size={24} style={{ verticalAlign: 'middle', marginRight: '0.5rem', color: 'var(--primary-600)' }} />
            Ventes
          </h2>
          <p className="page-header-subtitle">
            {data?.count ?? 0} vente{(data?.count ?? 0) > 1 ? 's' : ''} enregistrée{(data?.count ?? 0) > 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={handleExportCSV}>
            <LuDownload size={16} /> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <LuPlus size={16} /> Nouvelle vente
          </button>
        </div>
      </div>

      {/* Date Filters */}
      <div className="date-filters">
        <div className="date-group">
          <label>Date début</label>
          <input
            type="date"
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />
        </div>
        <div className="date-group">
          <label>Date fin</label>
          <input
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleDateFilter}>
          <LuFilter size={14} /> Filtrer
        </button>
        {(dateDebut || dateFin) && (
          <button className="btn btn-ghost btn-sm" onClick={clearDateFilter}>
            Réinitialiser
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <VenteList
            ventes={ventes}
            onViewDetail={(id) => setDetailId(id)}
            onCancel={handleCancelVente}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {showForm && (
        <Modal title="Nouvelle vente" onClose={() => setShowForm(false)}>
          <VenteForm
            onSubmit={handleCreateVente}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}

      {confirmCancel && (
        <ConfirmDialog
          title="Annuler la vente"
          message={`Êtes-vous sûr de vouloir annuler la vente ${confirmCancel.reference || '#' + confirmCancel.id} ? Le stock sera réintégré.`}
          variant="warning"
          confirmText="Annuler la vente"
          onConfirm={handleConfirmCancel}
          onCancel={() => setConfirmCancel(null)}
        />
      )}
    </div>
  );
};

export default VentesPage;
