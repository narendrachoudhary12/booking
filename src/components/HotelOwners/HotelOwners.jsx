import React, { useState, useEffect } from "react";
import "./HotelOwners.css";
import { Link } from 'react-router-dom';
import axios from "axios";

const HotelOwners = () => {
  const [totalHotels, setTotalHotels] = useState(0);

  useEffect(() => {
    axios.get("https://dhunobeats.com/api/cities")
      .then((res) => {
        const cities = res.data.data || [];
        const total = cities.reduce((acc, item) => acc + (item.hotels_count || 0), 0);
        setTotalHotels(total);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="ho-section">
      <div className="ho-container">
        <h2 className="ho-title">Get More Bookings for Your Hotel</h2>
        <p className="ho-subtitle">
          {/* Find out why over {totalHotels ? totalHotels.toLocaleString() : "..."} hotels managers trust Hotels.ng */}
          Find out why the best hotel managers have listed their hotels with Stay9ja Hotels
        </p>

        <Link to="/new-hotel" className="ho-btn">
          Add Your Hotel
        </Link>
      </div>
    </section>
  );
};

export default HotelOwners;