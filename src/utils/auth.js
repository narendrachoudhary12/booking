// Session helpers. Keys match what Login has always written, so existing
// sessions keep working.
const TOKEN_KEY = "token";
const TYPE_KEY = "type";
const NAME_KEY = "userName";
const IMAGE_KEY = "userImage";

// Fired when the saved name / photo changes, so the navbar can redraw
export const SESSION_EVENT = "s9-session-change";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUserType = () => localStorage.getItem(TYPE_KEY);
export const getUserName = () => localStorage.getItem(NAME_KEY);
export const getUserImage = () => localStorage.getItem(IMAGE_KEY);
export const isLoggedIn = () => Boolean(getToken());

// Name and photo shown in the navbar (call after login or a profile update)
export function setSessionUser(user) {
  if (user?.name) localStorage.setItem(NAME_KEY, user.name);

  if (user?.image) localStorage.setItem(IMAGE_KEY, user.image);
  else localStorage.removeItem(IMAGE_KEY);

  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function setSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TYPE_KEY, user?.type || "");
  setSessionUser(user);
}

export function clearSession() {
  [TOKEN_KEY, TYPE_KEY, NAME_KEY, IMAGE_KEY, "userRole", "admin"].forEach((key) =>
    localStorage.removeItem(key)
  );
}

export const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

// Where a logged-in user lands, by account type. Guests get /user; anything
// else non-admin is a hotel partner, as Login has always treated it.
export const GUEST_TYPES = ["user", "customer", "guest"];

export const dashboardPath = (type = getUserType()) => {
  if (type === "admin") return "/admin-dashboard";
  return GUEST_TYPES.includes(type) ? "/user" : "/host";
};

// Where to send someone right after login: back to the page that sent them
// to /login (admin pages only for admins), else their dashboard.
export const postLoginPath = (userType, from) =>
  from && (userType === "admin" || !from.startsWith("/admin"))
    ? from
    : dashboardPath(userType);
