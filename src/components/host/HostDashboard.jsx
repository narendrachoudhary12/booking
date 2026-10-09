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

import { useEffect, useState } from "react";
import Sidebar    from "./Sidebar";
import Topbar     from "./Topbar";
import RateModal  from "./RateModal";

import DashboardPage    from "../../pages/host/DashboardPage";
import BookingsPage     from "../../pages/host/BookingsPage";
import MyHotelsPage     from "../../pages/host/MyHotelsPage";
import PhotosPage       from "../../pages/host/PhotosPage";
import AvailabilityPage from "../../pages/host/AvailabilityPage";
import ChannelPage      from "../../pages/host/ChannelPage";
import RatesPage        from "../../pages/host/RatesPage";
import AccountPage      from "../../pages/host/AccountPage";
import { apiError, getHostHotels } from "../../services/hostApi";

import "../../styles/host-dashboard.css";

// Screens that are not connected to the API yet
const SAMPLE_PAGES = ["availability", "channel", "rates"];

function Message({ children, color = "var(--hd-muted)" }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color, fontSize: 15 }}>
      {children}
    </div>
  );
}

function PlaceholderPage({ name }) {
  return (
    <Message>
      📄 <strong>{name}</strong> page — coming soon
    </Message>
  );
}

export default function HostDashboard() {
  const [activePage, setActivePage]   = useState("dashboard");
  const [modalOpen, setModalOpen]     = useState(false);
  // Bumped when the owner edits their name, so the top bar reloads it
  const [profileVersion, setProfileVersion] = useState(0);

  // The owner's hotels and hotel requests: { hotels, requests } (null = loading)
  const [account, setAccount]     = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [hotelId, setHotelId]     = useState(null);

  const loadAccount = () =>
    getHostHotels()
      .then((data) => {
        setAccount(data);
        setLoadError(null);
        // Keep the selected hotel if it is still there, else pick the first
        setHotelId((current) =>
          data.hotels.some((h) => h.id === current)
            ? current
            : data.hotels[0]?.id ?? null
        );
      })
      .catch((err) => setLoadError(apiError(err)));

  useEffect(() => {
    loadAccount();
  }, []);

  const hotels = account?.hotels || [];
  const hotel  = hotels.find((h) => h.id === hotelId) || null;

  const renderPage = () => {
    // The account page does not depend on any hotel
    if (activePage === "account") {
      return <AccountPage onProfileChange={() => setProfileVersion((v) => v + 1)} />;
    }

    if (loadError) return <Message color="var(--hd-red)">{loadError}</Message>;
    if (!account)  return <Message>Loading…</Message>;

    const myHotels = (
      <MyHotelsPage hotels={hotels} requests={account.requests} onChanged={loadAccount} />
    );

    // Every other page is about one hotel; without one, show how to get one
    if (activePage === "hotels" || !hotel) return myHotels;

    switch (activePage) {
      case "dashboard":    return <DashboardPage hotel={hotel} onNavigate={setActivePage} />;
      case "bookings":     return <BookingsPage hotel={hotel} />;
      case "photos":       return <PhotosPage hotel={hotel} />;
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
        hotels={hotels}
        hotelId={hotelId}
        onHotelChange={setHotelId}
      />

      <main className="hd-main">
        <Topbar
          activePage={activePage}
          onNavigate={setActivePage}
          profileVersion={profileVersion}
          onOpenModal={() => setModalOpen(true)}
        />
        <div className="hd-content">
          {hotel && SAMPLE_PAGES.includes(activePage) && (
            <div className="hd-modal-notice" style={{ marginBottom: 16, fontSize: 13 }}>
              This screen still shows sample data. It is not connected to your hotel yet.
            </div>
          )}
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
