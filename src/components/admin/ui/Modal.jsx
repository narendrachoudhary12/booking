// components/admin/ui/Modal.jsx

/**
 * Dialog used by the admin pages. Renders as a form: pressing Enter or the
 * primary button calls onSubmit.
 *
 * Props: title, onClose, onSubmit, submitText, busy, children
 * Leave onSubmit out for a dialog that only shows information.
 */
export default function Modal({ title, onClose, onSubmit, submitText = "Save", busy, children }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <div className="s9-modal-bg open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form className="s9-modal" onSubmit={handleSubmit}>
        <div className="s9-modal-title">{title}</div>

        {children}

        <div className="s9-modal-footer">
          <button type="button" className="s9-btn s9-btn-outline" onClick={onClose}>
            {onSubmit ? "Cancel" : "Close"}
          </button>
          {onSubmit && (
            <button type="submit" className="s9-btn s9-btn-primary" disabled={busy}>
              {busy ? "Please wait..." : submitText}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
