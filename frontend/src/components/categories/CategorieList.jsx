import { LuPencil, LuTrash2, LuFolder, LuCalendarDays } from 'react-icons/lu';

const CARD_COLORS = [
  { bg: 'var(--primary-50)', border: 'var(--primary-200)', icon: 'var(--primary-600)', accent: 'var(--primary-500)' },
  { bg: 'var(--accent-50)', border: 'var(--accent-200)', icon: 'var(--accent-600)', accent: 'var(--accent-500)' },
  { bg: 'var(--success-50)', border: 'var(--success-100)', icon: 'var(--success-600)', accent: 'var(--success-500)' },
  { bg: 'var(--warning-50)', border: 'var(--warning-100)', icon: 'var(--warning-600)', accent: 'var(--warning-500)' },
  { bg: '#faf5ff', border: '#e9d5ff', icon: '#7c3aed', accent: '#8b5cf6' },
  { bg: '#fff1f2', border: '#fecdd3', icon: '#e11d48', accent: '#f43f5e' },
];

const CategorieList = ({ categories, onEdit, onDelete }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><LuFolder size={48} /></div>
        <p className="empty-state-text">Aucune catégorie trouvée</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--gray-400)', marginTop: '0.5rem' }}>
          Commencez par créer votre première catégorie de médicaments
        </p>
      </div>
    );
  }

  return (
    <div className="cat-grid">
      {categories.map((cat, index) => {
        const palette = CARD_COLORS[index % CARD_COLORS.length];
        return (
          <div
            key={cat.id}
            className="cat-card"
            style={{ '--cat-accent': palette.accent, '--cat-bg': palette.bg, '--cat-border': palette.border, '--cat-icon': palette.icon }}
          >
            <div className="cat-card-accent" />
            <div className="cat-card-body">
              <div className="cat-card-top">
                <div className="cat-card-icon">
                  <LuFolder size={22} />
                </div>
                <div className="cat-card-actions">
                  <button
                    className="cat-action-btn cat-action-edit"
                    onClick={() => onEdit(cat)}
                    title="Modifier"
                  >
                    <LuPencil size={14} />
                  </button>
                  <button
                    className="cat-action-btn cat-action-delete"
                    onClick={() => onDelete(cat)}
                    title="Supprimer"
                  >
                    <LuTrash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="cat-card-name">{cat.nom}</h3>

              <p className="cat-card-desc">
                {cat.description || 'Aucune description'}
              </p>

              <div className="cat-card-footer">
                <LuCalendarDays size={13} />
                <span>
                  {cat.date_creation
                    ? new Date(cat.date_creation).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '—'}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategorieList;
