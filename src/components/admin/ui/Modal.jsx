// components/admin/ui/Modal.jsx

/**
 * ConfirmTransferModal
 * Props:
 *   open     {boolean}  — modal visibility
 *   onClose  {function} — called when cancelled or confirmed
 */
export function ConfirmTransferModal({ open, onClose }) {
  return (
    <div
      className={`s9-modal-bg${open ? " open" : ""}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="s9-modal">
        <div className="s9-modal-title">✅ Confirm Bank Transfer</div>

        <div className="s9-alert s9-alert-gold">
          <span>⚠️</span>
          <span>
            Only confirm after you have verified the payment in your bank
            account.
          </span>
        </div>

        <div className="s9-form-row full">
          <div className="s9-form-group">
            <label className="s9-label">Booking Reference</label>
            <input
              className="s9-input"
              type="text"
              defaultValue="STY-2024-05819"
              readOnly
              style={{ background: "var(--bg)" }}
            />
          </div>
        </div>

        <div className="s9-form-row">
          <div className="s9-form-group">
            <label className="s9-label">Amount Received (₦)</label>
            <input className="s9-input" type="number" defaultValue="210000" />
          </div>
          <div className="s9-form-group">
            <label className="s9-label">Bank Reference No.</label>
            <input
              className="s9-input"
              type="text"
              placeholder="Bank transaction ID"
            />
          </div>
        </div>

        <div className="s9-form-row full">
          <div className="s9-form-group">
            <label className="s9-label">Confirmed By</label>
            <input
              className="s9-input"
              type="text"
              placeholder="Your name / staff ID"
            />
          </div>
        </div>

        <div className="s9-modal-footer">
          <button className="s9-btn s9-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="s9-btn s9-btn-primary" onClick={onClose}>
            Confirm Payment ✓
          </button>
        </div>
      </div>
    </div>
  );
}
