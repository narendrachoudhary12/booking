import React, { useEffect, useState } from "react";
import "./TopDeals.css";
import axios from "axios";
import { Link } from "react-router-dom";

const TopDeals = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("https://dhunobeats.com/api/hotels");
      setHotels(res.data);
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getHotelImage = (hotel) => {
  const baseUrl = "https://stay9jahotels.com/";
  const fallback =
    "https://images.timbu.com/hotels-ng/supplier_8ucykphmf0_1_260x240.jpg";

  if (hotel.images && hotel.images.length > 0) {
    try {
      const extraImages = JSON.parse(hotel.images[0].image_url);
      if (extraImages && extraImages.length > 0) {
        return baseUrl + extraImages[0];
      }
    } catch (e) {}
  }

  if (hotel.image) {
    return baseUrl + hotel.image;
  }

  return fallback;
};

  return (
    <section className="td-section">
      <div className="td-container">
        <h2 className="td-title">Today's Top Hotel Deals</h2>
        <p className="td-subtitle">
          A selection of the best hotel deals, only available today
        </p>

        <div className="td-grid">

          {loading ? (
            <p>Loading hotels...</p>
          ) : (
            hotels.slice(0, 6).map((hotel) => (
              <div className="td-card" key={hotel.id}>

                {/* ✅ FIXED LINK */}
                <Link to={`/hotel-details/${hotel.slug}`}>
                  <img
                    src={getHotelImage(hotel)}
                    alt={hotel.name}
                  />
                </Link>

                <div className="td-content">
                  <h4>{hotel.name}</h4>

                  <p>{hotel.address}</p>

                  {/* <p style={{ fontWeight: "bold", marginTop: "5px" }}>
                    ₦ {hotel.price_start_from}
                  </p> */}

                  <p style={{ color: "#f39c12" }}>
                    ⭐ {hotel.rating} ({hotel.total_reviews})
                  </p>

                </div>

              </div>
            ))
          )}

        </div>
      </div>
    </section>
  );
};

export default TopDeals;