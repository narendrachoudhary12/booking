// pages/host/ChannelPage.jsx

const CHANNELS = [
  { name: "Stay9ja (Direct)", status: "confirmed", statusLabel: "Active",        lastSync: "Live", bookings: 62, action: null },
  { name: "Booking.com",      status: "pending",   statusLabel: "Pending",       lastSync: "—",    bookings: "—", action: { label: "Verify",  cls: "hd-btn-primary" } },
  { name: "Expedia",          status: "cancelled", statusLabel: "Not connected", lastSync: "—",    bookings: "—", action: { label: "Connect", cls: "hd-btn-outline" } },
  { name: "Airbnb",           status: "cancelled", statusLabel: "Not connected", lastSync: "—",    bookings: "—", action: { label: "Connect", cls: "hd-btn-outline" } },
];

const BADGE_CLASS = {
  confirmed: "hd-badge-confirmed",
  pending:   "hd-badge-pending",
  cancelled: "hd-badge-cancelled",
};

export default function ChannelPage() {
  return (
    <div>
      {/* Connection form */}
      <div className="hd-card" style={{ marginBottom: 20 }}>
        <div className="hd-card-header"><div className="hd-card-title">Channel Manager Connection</div></div>
        <div className="hd-card-body">
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label>Channel Manager Provider</label>
              <select>
                <option>Channex</option><option>OTA Sync</option>
                <option>Direct PMS API</option><option>None (Extranet only)</option>
              </select>
            </div>
            <div className="hd-form-group">
              <label>API Key</label>
              <input type="password" placeholder="••••••••••••••••" />
            </div>
          </div>
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label>Property ID (on channel manager)</label>
              <input type="text" placeholder="e.g. PROP-12345" />
            </div>
            <div className="hd-form-group">
              <label>Webhook Endpoint</label>
              <input
                type="text"
                defaultValue="https://stay9jahotels.com/webhook/ari"
                readOnly
                style={{ background: "#f0f0ed", fontSize: 12 }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button className="hd-btn hd-btn-primary">Save &amp; Test Connection</button>
            <button className="hd-btn hd-btn-outline">Disconnect</button>
          </div>
        </div>
      </div>

      {/* Connected channels table */}
      <div className="hd-card">
        <div className="hd-card-header"><div className="hd-card-title">Connected Channels</div></div>
        <table className="hd-table">
          <thead>
            <tr>
              <th>Channel</th><th>Status</th><th>Last Sync</th>
              <th>Bookings (30d)</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {CHANNELS.map((c) => (
              <tr key={c.name}>
                <td><strong>{c.name}</strong></td>
                <td><span className={`hd-badge ${BADGE_CLASS[c.status]}`}>{c.statusLabel}</span></td>
                <td>{c.lastSync}</td>
                <td>{c.bookings}</td>
                <td>
                  {c.action ? (
                    <button className={`hd-btn ${c.action.cls} hd-btn-sm`}>{c.action.label}</button>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
