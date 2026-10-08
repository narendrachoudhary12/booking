import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { subscribe, getCurrent, closeCurrent } from "./popupService";
import "./Popup.css";

const ICONS = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "i",
  confirm: "?",
};

// Mount once near the app root. Renders whatever popup.* asked for.
export default function PopupHost() {
  const current = useSyncExternalStore(subscribe, getCurrent, getCurrent);
  const primaryRef = useRef(null);

  // Cancelling a confirm = false; dismissing a message just closes it
  const dismiss = () => closeCurrent(current?.isConfirm ? false : undefined);

  useEffect(() => {
    if (!current) return;

    primaryRef.current?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  if (!current) return null;

  return createPortal(
    <div
      className="s9-popup-overlay"
      onClick={(e) => e.target === e.currentTarget && dismiss()}
    >
      <div
        key={current.id}
        className={`s9-popup s9-popup--${current.type}`}
        role={current.isConfirm ? "alertdialog" : "alert"}
        aria-modal="true"
        aria-labelledby="s9-popup-title"
        aria-describedby="s9-popup-message"
      >
        <div className="s9-popup-icon" aria-hidden="true">
          {ICONS[current.type]}
        </div>

        <h3 id="s9-popup-title" className="s9-popup-title">
          {current.title}
        </h3>
        <p id="s9-popup-message" className="s9-popup-message">
          {current.message}
        </p>

        <div className="s9-popup-actions">
          {current.isConfirm && (
            <button
              type="button"
              className="s9-popup-btn s9-popup-btn--ghost"
              onClick={() => closeCurrent(false)}
            >
              {current.cancelText}
            </button>
          )}
          <button
            ref={primaryRef}
            type="button"
            className={`s9-popup-btn s9-popup-btn--primary${
              current.danger ? " s9-popup-btn--danger" : ""
            }`}
            onClick={() => closeCurrent(current.isConfirm ? true : undefined)}
          >
            {current.confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
