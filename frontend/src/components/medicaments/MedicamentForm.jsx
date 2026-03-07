import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useCategories from '../../hooks/useCategories';

/**
 * Formulaire de création/édition d'un médicament.
 * Backend Medicament model fields:
 *   nom, dci, categorie (FK), forme, dosage, prix_achat, prix_vente,
 *   stock_actuel, stock_minimum, date_expiration, ordonnance_requise, est_actif
 * Read-only (serializer): id, est_en_alerte, categorie_nom, date_creation
 */
const MedicamentForm = ({ initialData, onSubmit, onCancel }) => {
  const { data: categories } = useCategories();
  const isEdit = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    nom: '',
    dci: '',
    categorie: '',
    forme: '',
    dosage: '',
    prix_achat: '',
    prix_vente: '',
    stock_actuel: '',
    stock_minimum: '10',
    date_expiration: '',
    ordonnance_requise: false,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        nom: initialData.nom || '',
        dci: initialData.dci || '',
        categorie: initialData.categorie || '',
        forme: initialData.forme || '',
        dosage: initialData.dosage || '',
        prix_achat: initialData.prix_achat || '',
        prix_vente: initialData.prix_vente || '',
        stock_actuel: initialData.stock_actuel ?? '',
        stock_minimum: initialData.stock_minimum ?? '10',
        date_expiration: initialData.date_expiration || '',
        ordonnance_requise: initialData.ordonnance_requise || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.nom.trim()) {
      toast.error('Le nom du médicament est requis');
      return;
    }
    if (!formData.categorie) {
      toast.error('La catégorie est requise');
      return;
    }
    if (!formData.forme.trim()) {
      toast.error('La forme galénique est requise');
      return;
    }
    if (!formData.dosage.trim()) {
      toast.error('Le dosage est requis');
      return;
    }
    if (!formData.prix_achat || Number(formData.prix_achat) <= 0) {
      toast.error("Le prix d'achat doit être supérieur à 0");
      return;
    }
    if (!formData.prix_vente || Number(formData.prix_vente) <= 0) {
      toast.error('Le prix de vente doit être supérieur à 0');
      return;
    }
    if (Number(formData.prix_vente) < Number(formData.prix_achat)) {
      toast.error("Le prix de vente ne peut pas être inférieur au prix d'achat");
      return;
    }
    if (formData.stock_actuel === '' || Number(formData.stock_actuel) < 0) {
      toast.error('Le stock actuel est invalide');
      return;
    }
    if (!formData.date_expiration) {
      toast.error("La date d'expiration est requise");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        nom: formData.nom.trim(),
        dci: formData.dci.trim(),
        categorie: formData.categorie,
        forme: formData.forme.trim(),
        dosage: formData.dosage.trim(),
        prix_achat: formData.prix_achat,
        prix_vente: formData.prix_vente,
        stock_actuel: formData.stock_actuel,
        stock_minimum: formData.stock_minimum || 10,
        date_expiration: formData.date_expiration,
        ordonnance_requise: formData.ordonnance_requise,
      };

      await onSubmit(payload);
    } catch (err) {
      const errors = err.response?.data;
      if (errors && typeof errors === 'object') {
        const messages = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
          .join('\n');
        toast.error(messages || 'Erreur lors de la sauvegarde');
      } else {
        toast.error('Erreur lors de la sauvegarde');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Nom + DCI */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Nom <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Ex: Doliprane 1000mg"
            />
          </div>
          <div className="form-group">
            <label className="form-label">DCI</label>
            <input
              className="form-input"
              name="dci"
              value={formData.dci}
              onChange={handleChange}
              placeholder="Ex: Paracétamol"
            />
          </div>
        </div>

        {/* Catégorie + Forme + Dosage */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Catégorie <span className="required">*</span>
            </label>
            <select
              className="form-select"
              name="categorie"
              value={formData.categorie}
              onChange={handleChange}
            >
              <option value="">— Sélectionner —</option>
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Forme <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="forme"
              value={formData.forme}
              onChange={handleChange}
              placeholder="Ex: Comprimé, Sirop, Injection"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Dosage <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="Ex: 500mg, 200ml"
            />
          </div>
        </div>

        {/* Prix achat + Prix vente */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Prix d'achat (DH) <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="prix_achat"
              type="number"
              step="0.01"
              min="0"
              value={formData.prix_achat}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Prix de vente (DH) <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="prix_vente"
              type="number"
              step="0.01"
              min="0"
              value={formData.prix_vente}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Stock actuel + Stock minimum + Date expiration */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Stock actuel <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="stock_actuel"
              type="number"
              min="0"
              value={formData.stock_actuel}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Stock minimum (alerte)</label>
            <input
              className="form-input"
              name="stock_minimum"
              type="number"
              min="0"
              value={formData.stock_minimum}
              onChange={handleChange}
              placeholder="10"
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Date d'expiration <span className="required">*</span>
            </label>
            <input
              className="form-input"
              name="date_expiration"
              type="date"
              value={formData.date_expiration}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Ordonnance checkbox */}
        <div className="form-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              name="ordonnance_requise"
              checked={formData.ordonnance_requise}
              onChange={handleChange}
            />
            Ordonnance requise
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default MedicamentForm;
