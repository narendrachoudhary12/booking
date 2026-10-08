import { useHotelData } from "../../context/HotelDataContext";
import React from "react";
import "./PopularCities.css";
import { Link } from "react-router-dom";

const PopularCities = () => {

  const { cities: data } = useHotelData();

  return (
    <section className="pc-section">
      <div className="pc-container">
        <h2 className="pc-title">Popular Cities</h2>
        {/* <p className="pc-subtitle">
          See the top destinations people are traveling to
        </p> */}

        <div className="pc-grid">
          {data.slice(0, 4).map((city, index) => (
            <Link to={`/hotels/${city.slug.trim()}`} className="pc-card" key={index}>
              <img src={city.image} alt={city.name} />
              <h4>{city.name}</h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;