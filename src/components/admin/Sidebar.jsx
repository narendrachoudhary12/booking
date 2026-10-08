import AdminFooter from "./AdminFooter";
import { NAV_GROUPS } from "./constants";

export default function Sidebar({ activePage, onNav }) {
  return (
    <aside className="s9-sidebar">
      {/* Brand */}
      <div className="s9-sidebar-brand">
        <div className="s9-brand-name">Stay9ja</div>
        <div className="s9-brand-sub">Admin Panel</div>
      </div>

      {/* Navigation */}
      <nav className="s9-nav">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div className="s9-nav-group-label">
              {group.label}
            </div>

            {group.items.map((item) => (
              <div
                key={item.id}
                className={`s9-nav-item${
                  activePage === item.id ? " active" : ""
                }`}
                onClick={() => onNav(item.id)}
              >
                <span className="s9-nav-icon">
                  {item.icon}
                </span>

                <span>{item.label}</span>

                {item.badge && (
                  <span className="s9-nav-badge">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <AdminFooter />
    </aside>
  );
}