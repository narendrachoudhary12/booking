import Navbar from "../components/Navbar/Navbar";
import Dashboard from "../components/Dashboard/Dashboard";
import PageMeta from "../components/common/PageMeta";

function UserDashboard() {
  return (
    <>
      <PageMeta
        title="My Account | Stay9ja Hotels"
        description="Your Stay9ja Hotels bookings, profile and rewards."
      />
      <Navbar />
      <Dashboard />
    </>
  );
}

export default UserDashboard;
