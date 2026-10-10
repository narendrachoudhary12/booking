// Small display helpers shared by the partner dashboard pages.

export const money = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

export const shortDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export const BADGE_CLASS = {
  confirmed: "hd-badge-confirmed",
  pending: "hd-badge-pending",
  cancelled: "hd-badge-cancelled",
  completed: "hd-badge-completed",
};

// "pending" in the database means the guest has not paid yet
export const STATUS_LABEL = {
  confirmed: "confirmed",
  pending: "awaiting payment",
  cancelled: "cancelled",
  completed: "completed",
};

// "2026-10-10" for a Date, in local time (what <input type="date"> uses)
export const isoDate = (date = new Date()) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};

// "2026-10" -> "October 2026"
export const monthLabel = (month) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

// "2026-10" -> "Oct"
export const shortMonth = (month) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString("en-GB", { month: "short" });
