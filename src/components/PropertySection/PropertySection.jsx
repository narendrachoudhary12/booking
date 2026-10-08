import React, { useRef } from "react";
import "./PropertySection.css";

const PropertySection = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = 250;

    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // ✅ Same Data (images unchanged)
  const properties = [
    {
      title: "Hotels",
      count: "21 available",
      img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550862.jpeg?k=3514aa4abb76a6d19df104cb307b78b841ac0676967f24f4b860d289d55d3964&o=",
    },
    {
      title: "Resorts",
      count: "15 available",
      img: "https://q-xx.bstatic.com/xdata/images/hotel/263x210/620168315.jpeg?k=300d8d8059c8c5426ea81f65a30a7f93af09d377d4d8570bda1bd1f0c8f0767f&o=",
    },
    {
      title: "Apartments",
      count: "32 available",
      img: "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595551044.jpeg?k=262826efe8e21a0868105c01bf7113ed94de28492ee370f4225f00d1de0c6c44&o=",
    },
    {
      title: "Villas",
      count: "12 available",
      img: "https://q-xx.bstatic.com/xdata/images/hotel/263x210/620168315.jpeg?k=300d8d8059c8c5426ea81f65a30a7f93af09d377d4d8570bda1bd1f0c8f0767f&o=",
    },
    {
      title: "Hostels",
      count: "8 available",
      img: "https://r-xx.bstatic.com/xdata/images/hotel/263x210/595550862.jpeg?k=3514aa4abb76a6d19df104cb307b78b841ac0676967f24f4b860d289d55d3964&o=",
    },
    {
      title: "Guest Houses",
      count: "10 available",
      img: "https://q-xx.bstatic.com/xdata/images/hotel/263x210/595551044.jpeg?k=262826efe8e21a0868105c01bf7113ed94de28492ee370f4225f00d1de0c6c44&o=",
    },
  ];

  return (
    <section className="property-section">
      <h2>Browse by property type in Nigeria</h2>

      <div className="carousel-wrapper">
        <button className="nav prev" onClick={() => scroll("prev")}>
          ‹
        </button>

        <div className="property-carousel" ref={carouselRef}>
          {properties.map((item, index) => (
            <div className="property-card" key={index}>
              <img src={item.img} alt={item.title} />
              <h4>{item.title}</h4>
              <p>{item.count}</p>
            </div>
          ))}
        </div>

        <button className="nav next" onClick={() => scroll("next")}>
          ›
        </button>
      </div>
    </section>
  );
};

export default PropertySection;