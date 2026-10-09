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
