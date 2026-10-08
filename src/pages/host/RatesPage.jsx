// pages/host/RatesPage.jsx

export default function RatesPage({ onOpenModal }) {
  return (
    <div>
      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Rate Management</div>
          <button className="hd-btn hd-btn-primary hd-btn-sm" onClick={onOpenModal}>
            + Add Rate Plan
          </button>
        </div>
        <div className="hd-card-body">
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label>Room Type</label>
              <select>
                <option>All Rooms</option><option>Standard Room</option>
                <option>Deluxe Double</option><option>Executive Suite</option>
                <option>Presidential Suite</option>
              </select>
            </div>
            <div className="hd-form-group">
              <label>Rate Plan</label>
              <select>
                <option>Standard Rate</option><option>Weekend Rate</option>
                <option>Long Stay (7+ nights)</option><option>Early Bird</option>
              </select>
            </div>
          </div>
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label>From Date</label>
              <input type="date" defaultValue="2024-07-01" />
            </div>
            <div className="hd-form-group">
              <label>To Date</label>
              <input type="date" defaultValue="2024-07-31" />
            </div>
          </div>
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label>Rate Per Night (₦)</label>
              <input type="number" defaultValue={67500} step={500} />
            </div>
            <div className="hd-form-group">
              <label>Minimum Stay (nights)</label>
              <input type="number" defaultValue={1} min={1} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center" }}>
            <button className="hd-btn hd-btn-primary">Save Rates</button>
            <div style={{ fontSize: 12, color: "var(--hd-muted)" }}>
              Rates sync automatically to all connected channels
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
