import { LuTriangleAlert, LuX } from 'react-icons/lu';

const ConfirmDialog = ({ onConfirm, onCancel, title, message, confirmText = 'Confirmer', cancelText = 'Annuler', variant = 'danger' }) => {
  const colors = {
    danger: { bg: '#fef2f2', border: '#fecaca', icon: '#ef4444', btn: '#ef4444' },
    warning: { bg: '#fffbeb', border: '#fde68a', icon: '#f59e0b', btn: '#f59e0b' },
    info: { bg: '#eff6ff', border: '#bfdbfe', icon: '#3b82f6', btn: '#3b82f6' },
  };

  const c = colors[variant] || colors.danger;

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="confirm-close" onClick={onCancel}><LuX size={18} /></button>
        <div className="confirm-icon" style={{ backgroundColor: c.bg, border: `2px solid ${c.border}` }}>
          <LuTriangleAlert size={28} color={c.icon} />
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn-cancel" onClick={onCancel}>{cancelText}</button>
          <button className="confirm-btn-ok" style={{ backgroundColor: c.btn }} onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
