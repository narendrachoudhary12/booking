// pages/host/ChannelPage.jsx
// The hotel's channel manager details. The owner saves them here; a Stay9ja
// admin checks them and switches the connection on.

import { useEffect, useState } from "react";
import popup from "../../components/common/Popup/popupService";
import useLoad from "../../hooks/useLoad";
import {
  apiError,
  deleteHostChannel,
  getHostChannel,
  saveHostChannel,
} from "../../services/hostApi";
import Loadable from "./Loadable";
import { shortDate } from "./hostFormat";

// How each connection status is shown
const STATUS = {
  active: { cls: "connected", text: "Connected" },
  pending: { cls: "pending", text: "Details saved. Waiting for Stay9ja to switch the connection on." },
  disabled: { cls: "disconnected", text: "Switched off by Stay9ja. Contact support for details." },
};

export default function ChannelPage({ hotel }) {
  const { data, error, setData } = useLoad(() => getHostChannel(hotel.id), [hotel.id], apiError);

  const [form, setForm] = useState({ provider: "", property_id: "", api_key: "" });
  const [saving, setSaving] = useState(false);

  const connection = data?.connection;

  useEffect(() => {
    if (!data) return;
    setForm({
      provider: data.connection?.provider || data.providers[0],
      property_id: data.connection?.property_id || "",
      api_key: "",
    });
  }, [data]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await saveHostChannel(hotel.id, form);
      setData(res.data);
      popup.success(res.message);
    } catch (err) {
      popup.error(apiError(err));
    }

    setSaving(false);
  };

  const handleDisconnect = async () => {
    if (!(await popup.confirm("Disconnect the channel manager from this hotel?", { danger: true }))) return;

    try {
      setData(await deleteHostChannel(hotel.id));
      popup.success("Channel manager disconnected");
    } catch (err) {
      popup.error(apiError(err));
    }
  };

  return (
    <Loadable data={data} error={error}>
      {data && (
        <div style={{ maxWidth: 820 }}>
          <form className="hd-card" onSubmit={handleSubmit}>
            <div className="hd-card-header">
              <div className="hd-card-title">Channel manager connection</div>
            </div>
            <div className="hd-card-body">
              {connection ? (
                <div className={`hd-conn-status ${STATUS[connection.status]?.cls || "pending"}`}>
                  <div className="hd-conn-dot" />
                  {STATUS[connection.status]?.text || connection.status}
                </div>
              ) : (
                <div className="hd-conn-status disconnected">
                  <div className="hd-conn-dot" />
                  No channel manager connected
                </div>
              )}

              <div className="hd-form-row">
                <div className="hd-form-group">
                  <label>Provider</label>
                  <select value={form.provider} onChange={set("provider")} required>
                    {data.providers.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="hd-form-group">
                  <label>Property ID (at the provider)</label>
                  <input value={form.property_id} onChange={set("property_id")} placeholder="e.g. PROP-12345" required />
                </div>
              </div>

              <div className="hd-form-group" style={{ marginBottom: 12 }}>
                <label>API key</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={form.api_key}
                  onChange={set("api_key")}
                  placeholder={connection ? "Leave empty to keep the saved key" : "Paste the key from your provider"}
                  required={!connection}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button className="hd-btn hd-btn-primary" disabled={saving}>
                  {saving ? "Saving..." : "Save details"}
                </button>
                {connection && (
                  <button type="button" className="hd-btn hd-btn-outline" onClick={handleDisconnect}>
                    Disconnect
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="hd-card">
            <div className="hd-card-header">
              <div className="hd-card-title">Channels</div>
            </div>
            <table className="hd-table">
              <thead>
                <tr><th>Channel</th><th>Status</th><th>Bookings (30 days)</th><th>Last change</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Stay9ja (direct)</strong></td>
                  <td><span className="hd-badge hd-badge-confirmed">Active</span></td>
                  <td>{data.direct_bookings}</td>
                  <td>Live</td>
                </tr>
                {connection && (
                  <tr>
                    <td><strong>{connection.provider}</strong></td>
                    <td>
                      <span className={`hd-badge ${connection.status === "active" ? "hd-badge-confirmed" : connection.status === "pending" ? "hd-badge-pending" : "hd-badge-cancelled"}`}>
                        {connection.status}
                      </span>
                    </td>
                    <td>—</td>
                    <td>{shortDate(connection.updated_at)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Loadable>
  );
}
