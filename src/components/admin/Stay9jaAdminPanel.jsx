// components/admin/Stay9jaAdminPanel.jsx
// Main entry point - assembles all admin components
import { useCallback, useEffect, useState } from "react";

import adminStyles from "./styles";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { getCounts } from "../../services/adminApi";

// Pages
import Dashboard from "./Dashboard";
import AnalyticsPage from "./pages/AnalyticsPage";
import BookingsPage from "./pages/BookingsPage";
import HotelsPage from "./pages/HotelsPage";
import AddHotelPage from "./pages/AddHotelPage";
import AddHotelRoom from "./pages/AddHotelRoom";
import OwnersPage from "./pages/OwnersPage";
import ChannelsPage from "./pages/ChannelsPage";
import CitiesPage from "./pages/CitiesPage";
import PaymentsPage from "./pages/PaymentsPage";
import RefundsPage from "./pages/RefundsPage";
import PayoutsPage from "./pages/PayoutsPage";
import UsersPage from "./pages/UsersPage";
import SubscribersPage from "./pages/SubscribersPage";
import NotificationsPage from "./pages/NotificationsPage";
import SettingsPage from "./pages/SettingsPage";

export default function Stay9jaAdminPanel() {
  const [page, setPage] = useState("dashboard");
  // Text searched from the top bar; shown on the All Bookings page
  const [search, setSearch] = useState("");
  // Sidebar badges: things waiting for an admin
  const [counts, setCounts] = useState({});

  const loadCounts = useCallback(
    () => getCounts().then(setCounts).catch(() => {}),
    []
  );

  // Inject shared CSS once on mount
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = adminStyles;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Refresh the badges whenever the admin moves to another page
  useEffect(() => {
    loadCounts();
  }, [page, loadCounts]);

  const handleSearch = (text) => {
    setSearch(text);
    setPage("bookings");
  };

  function renderPage() {
    switch (page) {
      case "analytics":     return <AnalyticsPage />;
      case "bookings":      return <BookingsPage search={search} onChanged={loadCounts} />;
      case "pending":       return <BookingsPage lockedStatus="pending" onChanged={loadCounts} />;
      case "cancellations": return <BookingsPage lockedStatus="cancelled" onChanged={loadCounts} />;
      case "hotels":        return <HotelsPage onNav={setPage} />;
      case "add-hotel":     return <AddHotelPage />;
      case "add-rooms":     return <AddHotelRoom />;
      case "owners":        return <OwnersPage />;
      case "channel":       return <ChannelsPage onChanged={loadCounts} />;
      case "cities":        return <CitiesPage />;
      case "payments":      return <PaymentsPage onNav={setPage} onChanged={loadCounts} />;
      case "refunds":       return <RefundsPage onChanged={loadCounts} />;
      case "payouts":       return <PayoutsPage onChanged={loadCounts} />;
      case "users":         return <UsersPage />;
      case "subscribers":   return <SubscribersPage />;
      case "notifications": return <NotificationsPage />;
      case "settings":      return <SettingsPage />;
      default:              return <Dashboard onNav={setPage} />;
    }
  }

  return (
    <div className="s9-wrap">
      <Sidebar activePage={page} onNav={setPage} counts={counts} />

      <main className="s9-main">
        <Topbar activePage={page} onNav={setPage} onSearch={handleSearch} />
        <div className="s9-content">{renderPage()}</div>
      </main>
    </div>
  );
}
