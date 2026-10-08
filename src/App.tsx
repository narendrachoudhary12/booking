import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Admin / UI imports
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Admin from "./pages/Dashboard/Home";
import City from "./pages/admin/City/City";
import HotelList from "./pages/admin/Hotel/Hotel";
import HotelRoom from "./pages/admin/HotelRooms/HotelRooms";
import Users from "./pages/admin/Users/Users";
import Bookings from "./pages/admin/Bookings/Bookings";
import Profile from "./pages/admin/Profile/Profile";
import Stay9jaAdminPanel from "./components/admin/Stay9jaAdminPanel";
import HostDashboard from "./components/host/HostDashboard";
import Stay9jaHotelsTermsOfService from './pages/Stay9jaHotelsTermsOfService';
import Stay9jaHotelsPrivacyCookiePolicy from './pages/Stay9jaHotelsPrivacyCookiePolicy';

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
    !location.pathname.startsWith("/host") &&
    !location.pathname.startsWith("/user-dashboard");

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
        
        <Route path="/admin-dashboard" element={<Stay9jaAdminPanel />} />
        <Route path="/host" element={<HostDashboard />} />
        
        {/* ── Admin Routes (AppLayout ke andar) ── */}
        <Route path="/admin" >
          <Route index element={<Admin />} />
          <Route path="city" element={<City />} />
          <Route path="hotels" element={<HotelList />} />
          <Route path="hotelrooms" element={<HotelRoom />} />
          <Route path="users" element={<Users />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* ── Auth (standalone pages) ── */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />

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
      <AppRoutes />
    </BrowserRouter>
  );
}