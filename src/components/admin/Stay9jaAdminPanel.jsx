// components/admin/Stay9jaAdminPanel.jsx
// Main entry point - assembles all admin components
import { useState, useEffect } from "react";

import adminStyles from "./styles";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { PAGE_TITLES } from "./constants";
import { ConfirmTransferModal } from "./ui/Modal";

// Pages
import Dashboard from "./Dashboard";
import BookingsPage from "./pages/BookingsPage";
import HotelsPage from "./pages/HotelsPage";
import AddHotelPage from "./pages/AddHotelPage";
import PaymentsPage from "./pages/PaymentsPage";
import SettingsPage from "./pages/SettingsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import UsersPage from "./pages/UsersPage";
import AddHotelRoom from "./pages/AddHotelRoom";
import CitiesPage from "./pages/CitiesPage";

export default function Stay9jaAdminPanel() {
  const [page, setPage] = useState("dashboard");
  const [modalOpen, setModalOpen] = useState(false);

  // Inject shared CSS once on mount
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = adminStyles;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  function renderPage() {
    const openModal = () => setModalOpen(true);
    switch (page) {
      case "dashboard":  return <Dashboard onNav={setPage} openModal={openModal} />;
      case "bookings":   return <BookingsPage openModal={openModal} />;
      case "hotels":     return <HotelsPage onNav={setPage} />;
      case "add-hotel":  return <AddHotelPage />;
      case "payments":   return <PaymentsPage openModal={openModal} />;
      case "settings":   return <SettingsPage />;
      case "users":   return <UsersPage />;
      case "add-rooms":  return <AddHotelRoom />;
      case "cities": return <CitiesPage />;
      default:            return <PlaceholderPage title={PAGE_TITLES[page] || page} />;
    }
  }

  return (
    <div className="s9-wrap">
      <Sidebar activePage={page} onNav={setPage} />

      <main className="s9-main">
        <Topbar activePage={page} />
        <div className="s9-content">{renderPage()}</div>
      </main>

      <ConfirmTransferModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
