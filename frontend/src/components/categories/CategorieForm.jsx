import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * CategorieForm — Create / Edit a category.
 * Backend fields: nom (required, unique), description (optional).
 */
const CategorieForm = ({ categorie, onSubmit, onClose }) => {
  const [form, setForm] = useState({ nom: '', description: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (categorie) {
      setForm({
        nom: categorie.nom || '',
        description: categorie.description || '',
      });
    }
  }, [categorie]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.nom.trim()) {
      toast.error('Le nom de la catégorie est obligatoire');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        nom: form.nom.trim(),
        description: form.description.trim() || '',
      });
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        // Handle DRF validation errors (e.g. unique constraint on nom)
        const messages = Object.values(data).flat();
        messages.forEach((msg) => toast.error(String(msg)));
      } else {
        toast.error('Erreur lors de l\'enregistrement');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          Nom <span style={{ color: 'var(--danger-500)' }}>*</span>
        </label>
        <input
          type="text"
          name="nom"
          className="form-input"
          value={form.nom}
          onChange={handleChange}
          placeholder="Ex: Antalgique, Antibiotique…"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-input"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Description optionnelle de la catégorie"
          style={{ resize: 'vertical' }}
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
          Annuler
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Enregistrement…' : categorie ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default CategorieForm;
