// components/admin/pages/SettingsPage.jsx
// Platform settings. They are used by the API: the commission in hotel
// payouts, the cancellation window when a guest cancels, and the support
// contacts shown to guests.

import { useEffect, useState } from "react";
import popup from "../../common/Popup/popupService";
import useLoad from "../../../hooks/useLoad";
import { apiError, getSettings, saveSettings } from "../../../services/adminApi";
import Loadable from "../ui/Loadable";

export default function SettingsPage() {
  const { data, error, setData } = useLoad(getSettings, [], apiError);

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(data), [data]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      setData(await saveSettings(form));
      popup.success("Settings saved");
    } catch (err) {
      popup.error(apiError(err));
    }

    setSaving(false);
  };

  return (
    <Loadable data={form} error={error}>
      {form && (
        <form className="s9-card" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
          <div className="s9-card-head">
            <div className="s9-card-title">Platform settings</div>
          </div>
          <div className="s9-card-body">
            <div className="s9-form-row">
              <div className="s9-form-group">
                <label className="s9-label">Platform commission (%)</label>
                <input className="s9-input" type="number" min="0" max="90" step="0.1" value={form.commission_percent} onChange={set("commission_percent")} required />
              </div>
              <div className="s9-form-group">
                <label className="s9-label">Free cancellation until (hours before check-in)</label>
                <input className="s9-input" type="number" min="0" max="720" value={form.free_cancellation_hours} onChange={set("free_cancellation_hours")} required />
              </div>
            </div>

            <div className="s9-form-row">
              <div className="s9-form-group">
                <label className="s9-label">Support email</label>
                <input className="s9-input" type="email" value={form.support_email} onChange={set("support_email")} required />
              </div>
              <div className="s9-form-group">
                <label className="s9-label">Support phone</label>
                <input className="s9-input" type="tel" value={form.support_phone || ""} onChange={set("support_phone")} />
              </div>
            </div>

            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>
              The commission is taken from hotel payouts made after you save it.
              Guests can cancel a confirmed booking themselves until the
              cancellation window closes; 0 means they can never cancel online.
            </div>

            <button className="s9-btn s9-btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save settings"}
            </button>
          </div>
        </form>
      )}
    </Loadable>
  );
}
