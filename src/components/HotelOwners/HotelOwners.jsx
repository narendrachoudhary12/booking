import React from "react";
import "./HotelOwners.css";
import { Link } from 'react-router-dom';

const HotelOwners = () => {
  return (
    <section className="ho-section">
      <div className="ho-container">
        <h2 className="ho-title">Get More Bookings for Your Hotel</h2>
        <p className="ho-subtitle">
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