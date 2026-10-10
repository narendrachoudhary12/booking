// components/host/HostDashboard.jsx
// Entry point of the hotel partner dashboard (/host). Loads the owner's
// hotels, keeps track of the selected one and shows the active page.

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import DashboardPage from "../../pages/host/DashboardPage";
import BookingsPage from "../../pages/host/BookingsPage";
import MyHotelsPage from "../../pages/host/MyHotelsPage";
import PhotosPage from "../../pages/host/PhotosPage";
import RoomsPage from "../../pages/host/RoomsPage";
import ListingPage from "../../pages/host/ListingPage";
import AvailabilityPage from "../../pages/host/AvailabilityPage";
import RatesPage from "../../pages/host/RatesPage";
import ReviewsPage from "../../pages/host/ReviewsPage";
import PayoutsPage from "../../pages/host/PayoutsPage";
import AnalyticsPage from "../../pages/host/AnalyticsPage";
import ChannelPage from "../../pages/host/ChannelPage";
import AccountPage from "../../pages/host/AccountPage";
import { apiError, getHostHotels } from "../../services/hostApi";

import "../../styles/host-dashboard.css";

// Pages about the selected hotel. Each gets { hotel, onNavigate }.
const HOTEL_PAGES = {
  dashboard: DashboardPage,
  bookings: BookingsPage,
  availability: AvailabilityPage,
  rates: RatesPage,
  rooms: RoomsPage,
  listing: ListingPage,
  photos: PhotosPage,
  reviews: ReviewsPage,
  payouts: PayoutsPage,
  analytics: AnalyticsPage,
  channel: ChannelPage,
};

function Message({ children, color = "var(--hd-muted)" }) {
  return (
    <div style={{ padding: 40, textAlign: "center", color, fontSize: 15 }}>
      {children}
    </div>
  );
}

export default function HostDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
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

    const HotelPage = HOTEL_PAGES[activePage];

    // Every other page is about one hotel; without one, show how to get one
    if (!HotelPage || !hotel) {
      return <MyHotelsPage hotels={hotels} requests={account.requests} onChanged={loadAccount} />;
    }

    return <HotelPage hotel={hotel} onNavigate={setActivePage} />;
  };

  return (
    <div className="hd-root">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        hotels={hotels}
        hotelId={hotelId}
        onHotelChange={setHotelId}
        pendingRequests={(account?.requests || []).filter((r) => r.status === "pending").length}
      />

      <main className="hd-main">
        <Topbar
          activePage={activePage}
          onNavigate={setActivePage}
          profileVersion={profileVersion}
          hasHotel={Boolean(hotel)}
        />
        <div className="hd-content">{renderPage()}</div>
      </main>
    </div>
  );
}
