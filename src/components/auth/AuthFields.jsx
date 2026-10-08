import { useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import popup from "../common/Popup/popupService";
import { apiError, googleLogin } from "../../services/authApi";
import { postLoginPath, setSession } from "../../utils/auth";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Loads Google's sign-in script once, the first time a button needs it
let googleScript;
const loadGoogleScript = () => {
  googleScript ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return googleScript;
};

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

// "Sign in with Google". Google renders the real button and hands back an ID
// token, which the API verifies before logging the user in (new accounts are
// created on first use). mode: "signin" | "signup" only changes the wording.
export function GoogleButton({ mode = "signin" }) {
  const slotRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleCredential = async ({ credential }) => {
    try {
      const data = await googleLogin(credential);

      if (data.status === true) {
        setSession(data);
        navigate(postLoginPath(data.user?.type, from), { replace: true });
        return;
      }

      popup.error(data.message);
    } catch (error) {
      popup.error(apiError(error));
    }
  };

  // Google keeps the callback it was given first, so point it at the latest one
  const handlerRef = useRef(handleCredential);
  handlerRef.current = handleCredential;

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    loadGoogleScript()
      .then(() => {
        if (cancelled || !slotRef.current) return;

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => handlerRef.current(response),
        });
        window.google.accounts.id.renderButton(slotRef.current, {
          theme: "outline",
          size: "large",
          shape: "rectangular",
          logo_alignment: "center",
          text: mode === "signup" ? "signup_with" : "signin_with",
          width: Math.min(slotRef.current.offsetWidth, 400),
        });
      })
      .catch(() => {
        // Script blocked or offline: email sign-in below still works
      });

    return () => {
      cancelled = true;
    };
  }, [mode]);

  if (GOOGLE_CLIENT_ID) {
    return <div className="auth-google-slot" ref={slotRef} />;
  }

  // No client ID configured yet (see .env.example)
  return (
    <button
      type="button"
      className="auth-google"
      onClick={() =>
        popup.info("Google sign-in is coming soon. Please use your email for now.")
      }
    >
      <FcGoogle aria-hidden="true" />
      {mode === "signup" ? "Sign up with Google" : "Sign in with Google"}
    </button>
  );
}

export function Divider({ children }) {
  return <div className="auth-divider">{children}</div>;
}
