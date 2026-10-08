import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import popup from "../common/Popup/popupService";

// Labelled input with a leading icon. Extra props go straight to <input>.
export function TextField({ label, icon: Icon, action, ...inputProps }) {
  const id = useId();

  return (
    <div className="auth-field">
      <div className="auth-label-row">
        <label htmlFor={id}>{label}</label>
        {action}
      </div>
      <div className="auth-input-wrap">
        {Icon && <Icon className="auth-input-icon" aria-hidden="true" />}
        <input id={id} className="auth-input" {...inputProps} />
      </div>
    </div>
  );
}

// Password input with a show / hide toggle.
export function PasswordField({ label, icon: Icon, action, ...inputProps }) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-field">
      <div className="auth-label-row">
        <label htmlFor={id}>{label}</label>
        {action}
      </div>
      <div className="auth-input-wrap">
        {Icon && <Icon className="auth-input-icon" aria-hidden="true" />}
        <input
          id={id}
          className="auth-input auth-input--toggle"
          type={visible ? "text" : "password"}
          {...inputProps}
        />
        <button
          type="button"
          className="auth-eye"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
}

// UI only for now: Google OAuth is not connected to the backend yet.
export function GoogleButton({ label = "Continue with Google" }) {
  const handleClick = () => {
    popup.info("Google sign-in is coming soon. Please use your email for now.");
  };

  return (
    <button type="button" className="auth-google" onClick={handleClick}>
      <FcGoogle aria-hidden="true" />
      {label}
    </button>
  );
}

export function Divider({ children }) {
  return <div className="auth-divider">{children}</div>;
}
