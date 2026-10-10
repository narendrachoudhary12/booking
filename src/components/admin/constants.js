// Sidebar navigation. "count" names a number from the API (getCounts) that
// is shown as a badge when it is above zero.
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
      { id: "bookings", icon: "📋", label: "All Bookings" },
      { id: "pending", icon: "⏳", label: "Awaiting Payment", count: "pending_bookings" },
      { id: "cancellations", icon: "❌", label: "Cancellations" },
    ],
  },

  {
    label: "Hotels",
    items: [
      { id: "hotels", icon: "🏨", label: "All Hotels" },
      { id: "add-hotel", icon: "➕", label: "Add Hotel" },
      { id: "owners", icon: "🧑‍💼", label: "Hotel Owners", count: "hotel_requests" },
      { id: "channel", icon: "🔗", label: "Channel Manager", count: "channels" },
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
      { id: "refunds", icon: "↩️", label: "Refunds", count: "refunds" },
      { id: "payouts", icon: "💰", label: "Hotel Payouts", count: "payouts_due" },
    ],
  },

  {
    label: "System",
    items: [
      { id: "users", icon: "👥", label: "Users" },
      { id: "subscribers", icon: "✉️", label: "Deal Subscribers" },
      { id: "notifications", icon: "🔔", label: "Activity" },
      { id: "settings", icon: "⚙️", label: "Settings" },
    ],
  },
];

export const PAGE_TITLES = {
  dashboard: "Dashboard",
  analytics: "Analytics",

  bookings: "All Bookings",
  pending: "Bookings Awaiting Payment",
  cancellations: "Cancellations",

  hotels: "Hotels",
  "add-hotel": "Add Hotel",
  "add-rooms": "Hotel Rooms",
  owners: "Hotel Owners",
  channel: "Channel Manager",

  cities: "Cities",

  payments: "Payments",
  refunds: "Refunds",
  payouts: "Hotel Payouts",

  users: "Users",
  subscribers: "Deal Subscribers",
  notifications: "Activity",
  settings: "Settings",
};
