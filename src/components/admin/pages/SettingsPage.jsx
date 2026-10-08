// components/admin/pages/SettingsPage.jsx
import { StatusBadge, Toggle } from "../ui/Badges";

const GATEWAYS = [
  { name: "Paystack",      key: "pk_live_..." },
  { name: "Flutterwave",   key: "FLWPUBK_..." },
  { name: "Bank Transfer", key: "GTBank - 0123456789" },
];

const NOTIFICATIONS = [
  "Email confirmations",
  "SMS alerts (Termii)",
  "WhatsApp notifications",
  "Admin email alerts",
];

export default function SettingsPage() {
  return (
    <div className="s9-two-col">
      <div>
        {/* Payment Gateways */}
        <div className="s9-card">
          <div className="s9-card-head"><div className="s9-card-title">Payment Gateways</div></div>
          <div className="s9-card-body">
            {GATEWAYS.map((g, i, arr) => (
              <div
                key={g.name}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{g.key}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <StatusBadge status="confirmed" />
                  <Toggle />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="s9-card">
          <div className="s9-card-head"><div className="s9-card-title">Notifications</div></div>
          <div className="s9-card-body">
            {NOTIFICATIONS.map((n, i, arr) => (
              <div
                key={n}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <span style={{ fontSize: 13 }}>{n}</span>
                <Toggle />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div>
        <div className="s9-card">
          <div className="s9-card-head"><div className="s9-card-title">Platform Settings</div></div>
          <div className="s9-card-body">
            <div className="s9-form-row full">
              <div className="s9-form-group">
                <label className="s9-label">Platform Commission (%)</label>
                <input className="s9-input" type="number" defaultValue={15} />
              </div>
            </div>
            <div className="s9-form-row full">
              <div className="s9-form-group">
                <label className="s9-label">Default Currency</label>
                <select className="s9-input">
                  <option>NGN - Nigerian Naira</option>
                  <option>USD - US Dollar</option>
                </select>
              </div>
            </div>
            <div className="s9-form-row full">
              <div className="s9-form-group">
                <label className="s9-label">Cancellation Policy</label>
                <select className="s9-input">
                  <option>Free cancellation 24h before</option>
                  <option>Free cancellation 48h before</option>
                  <option>Non-refundable</option>
                </select>
              </div>
            </div>
            <div className="s9-form-row full">
              <div className="s9-form-group">
                <label className="s9-label">Support Email</label>
                <input className="s9-input" type="email" defaultValue="support@stay9jahotels.com" />
              </div>
            </div>
            <div className="s9-form-row full">
              <div className="s9-form-group">
                <label className="s9-label">Support Phone</label>
                <input className="s9-input" type="tel" defaultValue="+234 800 STAY9JA" />
              </div>
            </div>
            <button className="s9-btn s9-btn-primary" style={{ width: "100%", marginTop: 8 }}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
