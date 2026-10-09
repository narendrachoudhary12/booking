// components/host/Sidebar.jsx

// hotels: the owner's hotels; hotelId: the one the dashboard is showing
export default function Sidebar({ activePage, onNavigate, hotels = [], hotelId, onHotelChange }) {
  const hotel = hotels.find((h) => h.id === hotelId);

  const navItems = [
    {
      section: "Main",
      items: [
        { key: "dashboard",    icon: "📊", label: "Dashboard" },
        { key: "bookings",     icon: "📋", label: "Bookings" },
        { key: "availability", icon: "📅", label: "Availability" },
        { key: "rates",        icon: "💰", label: "Rates & Pricing" },
      ],
    },
    {
      section: "Property",
      items: [
        { key: "hotels",  icon: "🏨", label: "My Hotels" },
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
        { key: "account",   icon: "👤", label: "My Account" },
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
          <div className="hd-hotel-pill-name">
            {hotel ? hotel.name : "No hotel linked"}
          </div>
          <div className="hd-hotel-pill-id">
            {hotel ? `ID: ${hotel.id}` : "See My Hotels"}
          </div>
        </div>
      </div>

      {/* Hotel switcher, only for owners with more than one hotel */}
      {hotels.length > 1 && (
        <div className="hd-form-group" style={{ padding: "0 16px 12px" }}>
          <select
            aria-label="Switch hotel"
            value={hotelId ?? ""}
            onChange={(e) => onHotelChange(Number(e.target.value))}
          >
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>
      )}

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
