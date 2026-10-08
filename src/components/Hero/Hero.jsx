import React from "react";
import "./Hero.css";
import { FaBed, FaPlane, FaCar, FaTaxi } from "react-icons/fa";
import { MdAttractions } from "react-icons/md";
import { GiCommercialAirplane } from "react-icons/gi";

function Hero() {
  return (
    <>
      <div className="header">
        <div className="topbar">
          <div className="logo">Stay9jaHotel</div>

          <div className="nav-right">
            <span>NGN</span>
            <span className="currency">
                <img 
                    src="https://flagcdn.com/w20/ng.png" 
                    alt="Nigeria Flag" 
                    className="flag-icon"
                />
            </span>
            <span>List your property</span>
            <div className="btn white">Register</div>
            <div className="btn">Sign in</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div className="tab active">
            <FaBed /> Stays
          </div>
          <div className="hero-tab">
            <FaPlane /> Flights
          </div>
          <div className="hero-tab">
            <GiCommercialAirplane /> Flight + Hotel
          </div>
          <div className="hero-tab">
            <FaCar /> Car rental
          </div>
          <div className="hero-tab">
            <MdAttractions /> Attractions
          </div>
          <div className="hero-tab">
            <FaTaxi /> Airport taxis
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-inner">
          <h1>Find your next stay</h1>
          <p>Search deals on hotels, homes, and much more...</p>

          <div className="search-wrapper">
            <div className="search-box">
              <input type="text" placeholder="Where are you going?" />
              <input type="text" placeholder="Check-in — Check-out" />
              <input
                type="text"
                placeholder="2 adults · 0 children · 1 room"
              />
              <div className="search-btn">Search</div>
            </div>

            <div className="add-flights">
              <label>
                <input type="checkbox" />
                I'm looking for an entire home or apartment
              </label>

              <label>
                <input type="checkbox" />
                Add flights to my search
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;