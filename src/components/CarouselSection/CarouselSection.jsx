import React, { useRef } from "react";
import "./CarouselSection.css";

const CarouselSection = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = 250;

    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // ✅ Dynamic Data
  const places = [
    {
      name: "Jaipur",
      img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000014.jpg?k=2019d161de620bd520497ba57444bf9ab5b799768a16e611ef61adcdfea6876f&o=",
    },
    {
      name: "Rishikesh",
      img: "https://r-xx.bstatic.com/xdata/images/city/170x136/1000084.jpg?k=39393f013306de9da193b4172925ae27ebb8b3e0a0acc7f2542e4688fec0024c&o=",
    },
    {
      name: "Dwarka",
      img: "https://q-xx.bstatic.com/xdata/images/city/170x136/909083.jpg?k=450ef74bfe47149f8c1f69645d5884000aca4bcc529169891163e0487afe8615&o=",
    },
    {
      name: "Noida",
      img: "https://r-xx.bstatic.com/xdata/images/city/170x136/989885.jpg?k=9a442d0446f4acd0f7bc27efe674cbca0553f797b218b9c83025d7bdf67d870b&o=",
    },
    {
      name: "Bangalore",
      img: "https://r-xx.bstatic.com/xdata/images/city/170x136/990511.jpg?k=7a4ae0bcd342f9872b523ebc2463f973abe541c7f94d127dfe5a33a243c68234&o=",
    },
    {
      name: "Delhi",
      img: "https://r-xx.bstatic.com/xdata/images/city/170x136/990511.jpg?k=7a4ae0bcd342f9872b523ebc2463f973abe541c7f94d127dfe5a33a243c68234&o=",
    },
    {
      name: "Kolkata",
      img: "https://r-xx.bstatic.com/xdata/images/city/170x136/990511.jpg?k=7a4ae0bcd342f9872b523ebc2463f973abe541c7f94d127dfe5a33a243c68234&o=",
    },
  ];

  return (
    <section className="carousel-section">
      <h2>Explore India</h2>
      <p className="subtitle">
        These popular destinations have a lot to offer
      </p>

      <div className="carousel-wrapper">
        <button className="nav prev" onClick={() => scroll("prev")}>
          ‹
        </button>

        <div className="carousel" ref={carouselRef}>
          {places.map((place, index) => (
            <div className="card" key={index}>
              <img src={place.img} alt={place.name} />
              <p>{place.name}</p>
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

export default CarouselSection;