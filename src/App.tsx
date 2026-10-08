import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { HotelDataProvider } from "./context/HotelDataContext";

// Dashboards
import Stay9jaAdminPanel from "./components/admin/Stay9jaAdminPanel";
import HostDashboard from "./components/host/HostDashboard";

// Public pages
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import About from "./pages/About";
import Privacy from "./components/Privacy/Privacy";
import Register from "./pages/Register";
import Login from "./components/Login/Login";
import HotelDetailPage from "./pages/HotelDetailPage";
import NewHotel from "./pages/NewHotel";
import HotelBooking from "./pages/HotelBooking";
import BookingConfirmation from "./pages/BookingConfirmation";
import Stay9jaHotelsTermsOfService from "./pages/Stay9jaHotelsTermsOfService";
import Stay9jaHotelsPrivacyCookiePolicy from "./pages/Stay9jaHotelsPrivacyCookiePolicy";
import UserDashboard from "./pages/UserDashboard";
import NotFound from "./pages/NotFound";
import Footer from "./components/footer/Footer";
import "./App.css";

// ─── Inner component (has Router context) ────────────────────────────────────
function AppRoutes() {
  const location = useLocation();

  // Footer hide karo in paths par
  const noFooterPaths = ["/login", "/signup"];
  const showFooter =
    !noFooterPaths.includes(location.pathname) &&
    !location.pathname.startsWith("/admin") &&
    !location.pathname.startsWith("/host");

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ── Public Routes ── */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hotels/:slug" element={<Hotels />} />
        <Route path="/hotel-details/:slug" element={<HotelDetailPage />} />
        <Route path="/new-hotel" element={<NewHotel />} />
        <Route path="/hotel-booking" element={<HotelBooking />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
        <Route path="/Stay9jaHotelsTermsOfService" element={<Stay9jaHotelsTermsOfService />} />
        <Route path="/Stay9jaHotelsPrivacyCookiePolicy" element={<Stay9jaHotelsPrivacyCookiePolicy />} />

        {/* ── Dashboards (login required) ── */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allow={["admin"]}>
              <Stay9jaAdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/host"
          element={
            <ProtectedRoute>
              <HostDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Old URLs → current pages ── */}
        <Route path="/admin/*" element={<Navigate to="/admin-dashboard" replace />} />
        <Route path="/signin" element={<Navigate to="/login" replace />} />
        <Route path="/register" element={<Navigate to="/signup" replace />} />
        <Route path="/user-dashboard" element={<Navigate to="/user" replace />} />

        {/* ── 404 ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <HotelDataProvider>
        <AppRoutes />
      </HotelDataProvider>
    </BrowserRouter>
  );
}
