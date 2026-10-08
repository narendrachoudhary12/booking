// Reusable replacement for window.alert / window.confirm.
// <PopupHost /> is mounted once in App.tsx; call these from anywhere:
//
//   popup.success("Saved");            popup.error("Failed");
//   popup.warning("Enter email");      popup.info("Heads up");
//   if (!(await popup.confirm("Delete this hotel?"))) return;
//
// Every call returns a Promise that resolves when the popup is closed
// (confirm resolves true / false).

const DEFAULT_TITLES = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Notice",
  confirm: "Please confirm",
};

let queue = [];
let nextId = 1;
const listeners = new Set();

const emit = () => listeners.forEach((l) => l());

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// The popup currently on screen (others wait in the queue behind it)
export const getCurrent = () => queue[0] || null;

export const closeCurrent = (result) => {
  const current = queue[0];
  if (!current) return;
  queue = queue.slice(1);
  emit();
  current.resolve(result);
};

const open = (type, message, options = {}) =>
  new Promise((resolve) => {
    const isConfirm = type === "confirm";
    queue = [
      ...queue,
      {
        id: nextId++,
        type,
        isConfirm,
        message: message == null || message === "" ? "Something went wrong" : String(message),
        title: options.title || DEFAULT_TITLES[type],
        confirmText: options.confirmText || (isConfirm ? "Confirm" : "OK"),
        cancelText: options.cancelText || "Cancel",
        danger: Boolean(options.danger),
        resolve,
      },
    ];
    emit();
  });

export const popup = {
  success: (message, options) => open("success", message, options),
  error: (message, options) => open("error", message, options),
  warning: (message, options) => open("warning", message, options),
  info: (message, options) => open("info", message, options),
  // options: { title, confirmText, cancelText, danger }
  confirm: (message, options) => open("confirm", message, options),
};

export default popup;
