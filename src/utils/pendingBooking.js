// The room selection made on the hotel page. It is normally passed to
// /hotel-booking through router state, but that is lost when the user is sent
// to /login first, so a copy is kept for this browser tab.
const KEY = "pendingBooking";

export function savePendingBooking(bookingInfo) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(bookingInfo));
  } catch {
    // storage full or blocked: router state still works for logged-in users
  }
}

export function readPendingBooking() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}

export function clearPendingBooking() {
  sessionStorage.removeItem(KEY);
}
