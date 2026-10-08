import { useHotelData } from "../../context/HotelDataContext";
import React from "react";
import "./SuggestedDestinations.css";
import { Link } from "react-router-dom";

const SuggestedDestinations = () => {

  const { cities: data } = useHotelData();

  return (
    <section className="sd-section">
      <div className="sd-container">
        {/* <h2 className="sd-title">Suggested Destinations in Nigeria</h2>
        <p className="sd-subtitle">Most popular travel destinations</p> */}

        <div className="sd-grid">
          {data.slice(0, 6).map((item) => (
            <Link
              to={`/hotels/${item.slug.trim()}`}
              className="sd-link"
              key={item.id}
            >
              <div className="sd-card">
                <p className="sd-top-text">Hotels in</p>

                <h3 className="sd-city">{item.name.trim()}</h3>

                <p className="sd-hotels">{item.hotels_count || 0}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestedDestinations;