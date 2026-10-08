export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", icon: "📊", label: "Dashboard" },
      { id: "analytics", icon: "📈", label: "Analytics" },
    ],
  },

  {
    label: "Bookings",
    items: [
      { id: "bookings", icon: "📋", label: "All Bookings", badge: 7 },
      { id: "pending", icon: "⏳", label: "Pending", badge: 3 },
      { id: "cancellations", icon: "❌", label: "Cancellations" },
    ],
  },

  {
    label: "Hotels",
    items: [
      { id: "hotels", icon: "🏨", label: "All Hotels" },
      { id: "add-hotel", icon: "➕", label: "Add Hotel" },
      { id: "channel", icon: "🔗", label: "Channel Manager" },
    ],
  },

  {
    label: "Cities",
    items: [
      { id: "cities", icon: "🌆", label: "All Cities" },
    ],
  },

  {
    label: "Finance",
    items: [
      { id: "payments", icon: "💳", label: "Payments" },
      { id: "refunds", icon: "↩️", label: "Refunds" },
      { id: "payouts", icon: "💰", label: "Hotel Payouts" },
    ],
  },

  {
    label: "System",
    items: [
      { id: "users", icon: "👥", label: "Users" },
      { id: "notifications", icon: "🔔", label: "Notifications" },
      { id: "settings", icon: "⚙️", label: "Settings" },
    ],
  },
];

export const PAGE_TITLES = {
  dashboard: "Dashboard",
  analytics: "Analytics",

  bookings: "All Bookings",
  pending: "Pending Bookings",
  cancellations: "Cancellations",

  hotels: "Hotels",
  "add-hotel": "Add Hotel",
  channel: "Channel Manager",

  cities: "Cities",

  payments: "Payments",
  refunds: "Refunds",
  payouts: "Hotel Payouts",

  users: "Users",
  notifications: "Notifications",
  settings: "Settings",
};