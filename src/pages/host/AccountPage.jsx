// pages/host/AccountPage.jsx
// The hotel owner's own account: details and password.

import { useEffect, useState } from "react";
import popup from "../../components/common/Popup/popupService";
import { getProfile } from "../../services/bookingApi";
import { changePassword, updateProfile } from "../../services/accountApi";
import { setSessionUser } from "../../utils/auth";

const apiError = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

const EMPTY_PASSWORDS = {
  current_password: "",
  password: "",
  confirm_password: "",
};

export default function AccountPage({ onProfileChange }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", last_name: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [changing, setChanging] = useState(false);

  const applyProfile = (user) => {
    setProfile(user);
    setForm({
      name: user?.name || "",
      last_name: user?.last_name || "",
      phone: user?.phone ? String(user.phone) : "",
    });
  };

  useEffect(() => {
    getProfile()
      .then(applyProfile)
      .catch(() => popup.error("We could not load your account details."));
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setPwd = (key) => (e) =>
    setPasswords({ ...passwords, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const user = await updateProfile({
        name: form.name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.replace(/\D/g, ""),
      });

      applyProfile(user);
      setSessionUser(user); // name shown in the site navbar
      onProfileChange?.(user); // name shown in this dashboard's top bar
      popup.success("Account details updated");
    } catch (error) {
      popup.error(apiError(error));
    }

    setSaving(false);
  };

  const handlePassword = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirm_password) {
      popup.warning("New passwords do not match");
      return;
    }

    setChanging(true);

    try {
      await changePassword(passwords);
      setPasswords(EMPTY_PASSWORDS);
      popup.success("Password changed");
    } catch (error) {
      popup.error(apiError(error));
    }

    setChanging(false);
  };

  return (
    <div style={{ maxWidth: 720 }}>
      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Account details</div>
        </div>

        <form className="hd-card-body" onSubmit={handleSave}>
          <div className="hd-form-row">
            <div className="hd-form-group">
              <label htmlFor="acc-first">First name</label>
              <input id="acc-first" required value={form.name} onChange={set("name")} />
            </div>
            <div className="hd-form-group">
              <label htmlFor="acc-last">Last name</label>
              <input id="acc-last" value={form.last_name} onChange={set("last_name")} />
            </div>
          </div>

          <div className="hd-form-row">
            <div className="hd-form-group">
              <label htmlFor="acc-email">Email (your login)</label>
              <input id="acc-email" value={profile?.email || ""} disabled />
            </div>
            <div className="hd-form-group">
              <label htmlFor="acc-phone">Phone number</label>
              <input id="acc-phone" type="tel" value={form.phone} onChange={set("phone")} />
            </div>
          </div>

          {profile?.business_name && (
            <div className="hd-form-group" style={{ marginBottom: 12 }}>
              <label htmlFor="acc-business">Hotel / business name</label>
              <input id="acc-business" value={profile.business_name} disabled />
            </div>
          )}

          <div className="hd-modal-footer">
            <button className="hd-btn hd-btn-primary" disabled={saving || !profile}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="hd-card">
        <div className="hd-card-header">
          <div className="hd-card-title">Change password</div>
        </div>

        <form className="hd-card-body" onSubmit={handlePassword}>
          <div className="hd-form-group" style={{ marginBottom: 12 }}>
            <label htmlFor="acc-current">Current password</label>
            <input
              id="acc-current"
              type="password"
              autoComplete="current-password"
              required
              value={passwords.current_password}
              onChange={setPwd("current_password")}
            />
          </div>

          <div className="hd-form-row">
            <div className="hd-form-group">
              <label htmlFor="acc-new">New password</label>
              <input
                id="acc-new"
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                minLength={8}
                required
                value={passwords.password}
                onChange={setPwd("password")}
              />
            </div>
            <div className="hd-form-group">
              <label htmlFor="acc-confirm">Confirm new password</label>
              <input
                id="acc-confirm"
                type="password"
                autoComplete="new-password"
                required
                value={passwords.confirm_password}
                onChange={setPwd("confirm_password")}
              />
            </div>
          </div>

          <div className="hd-modal-footer">
            <button className="hd-btn hd-btn-primary" disabled={changing}>
              {changing ? "Changing..." : "Change password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
