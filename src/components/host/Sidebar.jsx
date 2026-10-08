// components/host/Sidebar.jsx

export default function Sidebar({ activePage, onNavigate, badgeCount }) {
  const navItems = [
    {
      section: "Main",
      items: [
        { key: "dashboard",    icon: "📊", label: "Dashboard" },
        { key: "bookings",     icon: "📋", label: "Bookings", badge: badgeCount },
        { key: "availability", icon: "📅", label: "Availability" },
        { key: "rates",        icon: "💰", label: "Rates & Pricing" },
      ],
    },
    {
      section: "Property",
      items: [
        { key: "rooms",   icon: "🛏️", label: "Room Types" },
        { key: "listing", icon: "📝", label: "Listing Details" },
        { key: "photos",  icon: "🖼️", label: "Photos & Media" },
      ],
    },
    {
      section: "System",
      items: [
        { key: "channel",   icon: "🔗", label: "Channel Manager" },
        { key: "analytics", icon: "📈", label: "Analytics" },
        { key: "settings",  icon: "⚙️", label: "Settings" },
      ],
    },
  ];

  return (
    <aside className="hd-sidebar">
      {/* Brand */}
      <div className="hd-sidebar-brand">
        <div className="hd-brand-logo">Stay9ja</div>
        <div className="hd-brand-sub">Hotel Partner Portal</div>
      </div>

      {/* Hotel pill */}
      <div className="hd-hotel-pill">
        <div className="hd-hotel-pill-icon">🏨</div>
        <div>
          <div className="hd-hotel-pill-name">Eko Suites &amp; Towers</div>
          <div className="hd-hotel-pill-id">ID: HTL-00142</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="hd-nav">
        {navItems.map(({ section, items }) => (
          <div key={section}>
            <div className="hd-nav-section">{section}</div>
            {items.map(({ key, icon, label, badge }) => (
              <a
                key={key}
                className={`hd-nav-item${activePage === key ? " active" : ""}`}
                onClick={() => onNavigate(key)}
              >
                <span className="hd-nav-icon">{icon}</span>
                {label}
                {badge > 0 && <span className="hd-nav-badge">{badge}</span>}
              </a>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="hd-sidebar-footer">
        <div>v1.0 · Stay9ja Partner</div>
        <div style={{ marginTop: 4 }}>© 2024 Stay9ja Hotels</div>
      </div>
    </aside>
  );
}
