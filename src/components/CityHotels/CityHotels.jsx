import { useHotelData } from "../../context/HotelDataContext";
import React from "react";
import "./CityHotels.css";
import { Link } from "react-router-dom";

const CityHotels = () => {
  const { cities: data, totalCities, totalHotels } = useHotelData();

  return (
    <section className="city-sd-section">
      <div className="city-sd-container">
        {/* <h2 className="city-sd-title">
          Which City Do You Want To Book A Hotel ?
        </h2> */}
        {/* <p className="city-sd-subtitle"> */}
         {/* <h2 className="city-sd-title">
          {totalHotels} hotels in {totalCities} cities / towns in Nigeria
        </h2> */}
        <h2 className="city-sd-title">
          1000+ luxury hotels in major cities/towns in Nigeria
        </h2>

        <div className="city-sd-grid">
          {data.map((item, index) => (
            
              <Link to={`/hotels/${item.slug.trim()}`} 
                     className="city-sd-card" 
                     key={item.id}
              >
              <h3 className="city-sd-city">Hotel in {item.name}</h3>
              <p className="city-sd-hotels">
                {item.hotels_count || 0} hotels in {item.name}
              </p>
              <p className="city-sd-hotels">
                over {item.total_reviews || 0} hotel reviews
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CityHotels;