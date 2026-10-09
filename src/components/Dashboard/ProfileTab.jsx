import { useEffect, useRef, useState } from "react";
import popup from "../common/Popup/popupService";
import { changePassword, updateProfile } from "../../services/accountApi";

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // same 2 MB limit as the API

const apiError = (error) =>
  error.response?.data?.message || "Something went wrong. Please try again.";

// Edit name, phone and photo, and change the password.
// onSaved(user) gets the user as saved by the server.
export default function ProfileTab({ profile, onSaved }) {
  const fileRef = useRef(null);

  const [form, setForm] = useState({ name: "", last_name: "", phone: "" });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [saving, setSaving] = useState(false);

  const [passwords, setPasswords] = useState({
    current_password: "",
    password: "",
    confirm_password: "",
  });
  const [changing, setChanging] = useState(false);

  // Fill the form once the profile has loaded (and after each save)
  useEffect(() => {
    if (!profile) return;

    setForm({
      name: profile.name || "",
      last_name: profile.last_name || "",
      phone: profile.phone ? String(profile.phone) : "",
    });
    setImageFile(null);
    setRemoveImage(false);
  }, [profile]);

  // Local preview of the photo that was just picked
  useEffect(() => {
    if (!imageFile) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const shownImage = preview || (removeImage ? null : profile?.image);
  const initial = (form.name || "G").trim().charAt(0).toUpperCase();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setPwd = (key) => (e) =>
    setPasswords({ ...passwords, [key]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the same file be picked again
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      popup.warning("Please choose an image file (JPG, PNG or WebP).");
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      popup.warning("The photo must be 2 MB or smaller.");
      return;
    }

    setImageFile(file);
    setRemoveImage(false);
  };

  const handleRemove = () => {
    setImageFile(null);
    setRemoveImage(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const user = await updateProfile({
        name: form.name.trim(),
        last_name: form.last_name.trim(),
        phone: form.phone.replace(/\D/g, ""),
        image: imageFile,
        remove_image: removeImage && !imageFile ? true : undefined,
      });

      onSaved(user);
      popup.success("Profile updated");
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
      setPasswords({ current_password: "", password: "", confirm_password: "" });
      popup.success("Password changed");
    } catch (error) {
      popup.error(apiError(error));
    }

    setChanging(false);
  };

  return (
    <>
      <form className="ua-panel ua-form" onSubmit={handleSave}>
        <h2 className="ua-panel-title">Personal details</h2>

        <div className="ua-photo">
          {shownImage ? (
            <img src={shownImage} alt="" className="ua-avatar ua-avatar--lg" />
          ) : (
            <div className="ua-avatar ua-avatar--lg">{initial}</div>
          )}

          <div className="ua-photo-actions">
            <button
              type="button"
              className="ua-btn ua-btn--ghost"
              onClick={() => fileRef.current?.click()}
            >
              {shownImage ? "Change photo" : "Upload photo"}
            </button>
            {shownImage && (
              <button type="button" className="ua-link-btn" onClick={handleRemove}>
                Remove
              </button>
            )}
            <span className="ua-hint">JPG, PNG or WebP, up to 2 MB</span>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            hidden
            onChange={handleFile}
          />
        </div>

        <div className="ua-form-row">
          <label className="ua-field">
            <span>First name</span>
            <input
              className="ua-input"
              required
              autoComplete="given-name"
              value={form.name}
              onChange={set("name")}
            />
          </label>
          <label className="ua-field">
            <span>Last name</span>
            <input
              className="ua-input"
              autoComplete="family-name"
              value={form.last_name}
              onChange={set("last_name")}
            />
          </label>
        </div>

        <div className="ua-form-row">
          <label className="ua-field">
            <span>Email</span>
            <input className="ua-input" value={profile?.email || ""} disabled />
            <small className="ua-hint">Your email is your login and cannot be changed.</small>
          </label>
          <label className="ua-field">
            <span>Phone number</span>
            <input
              className="ua-input"
              type="tel"
              autoComplete="tel-national"
              placeholder="Digits only, without country code"
              value={form.phone}
              onChange={set("phone")}
            />
          </label>
        </div>

        <div>
          <button className="ua-btn" disabled={saving || !profile}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>

      <form className="ua-panel ua-form" onSubmit={handlePassword}>
        <h2 className="ua-panel-title">Change password</h2>

        <label className="ua-field">
          <span>Current password</span>
          <input
            className="ua-input"
            type="password"
            autoComplete="current-password"
            required
            value={passwords.current_password}
            onChange={setPwd("current_password")}
          />
        </label>

        <div className="ua-form-row">
          <label className="ua-field">
            <span>New password</span>
            <input
              className="ua-input"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              minLength={8}
              required
              value={passwords.password}
              onChange={setPwd("password")}
            />
          </label>
          <label className="ua-field">
            <span>Confirm new password</span>
            <input
              className="ua-input"
              type="password"
              autoComplete="new-password"
              required
              value={passwords.confirm_password}
              onChange={setPwd("confirm_password")}
            />
          </label>
        </div>

        <div>
          <button className="ua-btn" disabled={changing}>
            {changing ? "Changing..." : "Change password"}
          </button>
        </div>
      </form>
    </>
  );
}
