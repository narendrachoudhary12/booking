// HostDashboard.jsx  ← main entry point
// Place inside: components/host/HostDashboard.jsx
//
// Folder structure:
//   components/host/
//     HostDashboard.jsx       ← this file (entry)
//     Sidebar.jsx
//     Topbar.jsx
//     RateModal.jsx
//   pages/host/
//     DashboardPage.jsx
//     AvailabilityPage.jsx
//     ChannelPage.jsx
//     RatesPage.jsx
//   styles/
//     host-dashboard.css

import { useState } from "react";
import Sidebar    from "./Sidebar";
import Topbar     from "./Topbar";
import RateModal  from "./RateModal";

import DashboardPage    from "../../pages/host/DashboardPage";
import AvailabilityPage from "../../pages/host/AvailabilityPage";
import ChannelPage      from "../../pages/host/ChannelPage";
import RatesPage        from "../../pages/host/RatesPage";

import "../../styles/host-dashboard.css";

function PlaceholderPage({ name }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "var(--hd-muted)", fontSize: 15 }}>
      📄 <strong>{name}</strong> page — coming soon
    </div>
  );
}

export default function HostDashboard() {
  const [activePage, setActivePage]   = useState("dashboard");
  const [modalOpen, setModalOpen]     = useState(false);
  const [badgeCount, setBadgeCount]   = useState(3);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":    return <DashboardPage onNavigate={setActivePage} onBadgeChange={setBadgeCount} />;
      case "availability": return <AvailabilityPage />;
      case "channel":      return <ChannelPage />;
      case "rates":        return <RatesPage onOpenModal={() => setModalOpen(true)} />;
      default:             return <PlaceholderPage name={activePage} />;
    }
  };

  return (
    <div className="hd-root">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        badgeCount={badgeCount}
      />

      <main className="hd-main">
        <Topbar
          activePage={activePage}
          onOpenModal={() => setModalOpen(true)}
        />
        <div className="hd-content">
          {renderPage()}
        </div>
      </main>

      <RateModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
