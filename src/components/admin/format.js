// Small display helpers shared by the admin pages.

export const money = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

// Large amounts in short form for stat cards: ₦28.4M, ₦840K
export const shortMoney = (amount) => {
  const n = Number(amount || 0);
  if (n >= 1e6) return `₦${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e4) return `₦${Math.round(n / 1e3)}K`;
  return money(n);
};

export const shortDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";

// "2026-10" -> "Oct"
export const shortMonth = (month) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString("en-GB", { month: "short" });

// "5m ago", "3h ago", "2d ago", then the date. Server times are "Y-m-d H:i:s".
export const timeAgo = (time) => {
  const then = new Date(String(time).replace(" ", "T"));
  const minutes = Math.round((Date.now() - then.getTime()) / 60000);

  if (Number.isNaN(minutes)) return "";
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 60 * 24) return `${Math.round(minutes / 60)}h ago`;
  if (minutes < 60 * 24 * 7) return `${Math.round(minutes / 1440)}d ago`;
  return shortDate(then);
};

// "+18% vs last month", or null when there is nothing to compare with
export const trend = (now, before) => {
  if (!before) return null;

  const change = Math.round(((now - before) / before) * 100);
  return { up: change >= 0, text: `${change >= 0 ? "↑ +" : "↓ "}${change}% vs last month` };
};

// "pending" in the database means the guest has not paid yet
export const STATUS_LABEL = {
  confirmed: "confirmed",
  pending: "awaiting payment",
  cancelled: "cancelled",
  completed: "completed",
};
