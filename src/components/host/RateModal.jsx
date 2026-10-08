// components/host/RateModal.jsx

export default function RateModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="hd-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="hd-modal">
        <div className="hd-modal-title">Update Room Rates</div>

        <div className="hd-form-group" style={{ marginBottom: 12 }}>
          <label>Room Type</label>
          <select>
            <option>Deluxe Double</option>
            <option>Standard Room</option>
            <option>Executive Suite</option>
          </select>
        </div>

        <div className="hd-form-row">
          <div className="hd-form-group">
            <label>Start Date</label>
            <input type="date" />
          </div>
          <div className="hd-form-group">
            <label>End Date</label>
            <input type="date" />
          </div>
        </div>

        <div className="hd-form-group" style={{ marginBottom: 12 }}>
          <label>New Rate (₦ per night)</label>
          <input type="number" placeholder="e.g. 75000" step="500" />
        </div>

        <div className="hd-form-group" style={{ marginBottom: 12 }}>
          <label>Reason / Note (optional)</label>
          <input type="text" placeholder="e.g. Weekend surcharge, Public holiday rate" />
        </div>

        <div className="hd-modal-notice">
          ⚡ Rate changes sync immediately to Stay9ja and all connected channel managers.
        </div>

        <div className="hd-modal-footer">
          <button className="hd-btn hd-btn-outline" onClick={onClose}>Cancel</button>
          <button className="hd-btn hd-btn-primary" onClick={onClose}>Save &amp; Sync Rates</button>
        </div>
      </div>
    </div>
  );
}
