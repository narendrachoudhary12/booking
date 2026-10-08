import React, { useEffect, useState } from 'react'
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import BasicTablefifth from "../../../components/tables/BasicTables/BasicTablefifth";


function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("https://dhunobeats.com/api/admin/bookings", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (Array.isArray(result)) {
          setBookings(result);
        } else if (result.status === true) {
          setBookings(result.data);
        } else {
          setError("Data load karne mein problem hui");
        }
      } catch (err) {
        setError("API error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <>
      <PageMeta
        title="Bookings | Admin Dashboard"
        description="Bookings list"
      />
      <PageBreadcrumb pageTitle="Hotel Bookings" />
      <div className="space-y-6">
        <ComponentCard title="Bookings List">
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="py-10 text-center text-red-500">{error}</div>
          ) : (
            <BasicTablefifth data={bookings} />
          )}
        </ComponentCard>
      </div>
    </>
  );
}

export default Bookings;