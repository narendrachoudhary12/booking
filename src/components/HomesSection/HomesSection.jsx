import React, { useRef } from "react";
import "./HomesSection.css";

const HomesSection = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const cardWidth =
      carouselRef.current.querySelector(".home-card").offsetWidth + 16;

    carouselRef.current.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  const data = [
    {
      title: "Aparthotel Stare Miasto",
      location: "Old Town, Krakow",
      rating: "8.8",
      ratingText: "Excellent",
      reviews: "(776 reviews)",
      price: "₹9,688",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/531732579.webp?k=df9d17c4371175b0e4a60e390083280c837d5e94dacc7d9ae6db48728b5fb5ff&o=",
    },
    {
      title: "Leman Locke",
      location: "Port Harcourt, Nigeria",
      rating: "8.3",
      ratingText: "Very Good",
      reviews: "",
      price: "₹36,530",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/531732579.webp?k=df9d17c4371175b0e4a60e390083280c837d5e94dacc7d9ae6db48728b5fb5ff&o=",
    },
    {
      title: "Aparthotel Stare Miasto",
      location: "Calabar, Nigeria",
      rating: "8.3",
      ratingText: "Very Good",
      reviews: "",
      price: "₹36,530",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/531732579.webp?k=df9d17c4371175b0e4a60e390083280c837d5e94dacc7d9ae6db48728b5fb5ff&o=",
    },
    {
      title: "Leman Locke",
      location: "Port Harcourt, Nigeria",
      rating: "8.8",
      ratingText: "Excellent",
      reviews: "(776 reviews)",
      price: "₹36,530",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/531732579.webp?k=df9d17c4371175b0e4a60e390083280c837d5e94dacc7d9ae6db48728b5fb5ff&o=",
    },
    {
      title: "Leman Locke",
      location: "Port Harcourt, Nigeria",
      rating: "8.8",
      ratingText: "Excellent",
      reviews: "(776 reviews)",
      price: "₹36,530",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/531732579.webp?k=df9d17c4371175b0e4a60e390083280c837d5e94dacc7d9ae6db48728b5fb5ff&o=",
    },
  ];

  return (
    <section className="home-homes-section">
      <div className="home-container">
        <div className="home-header">
          <h2>Homes guests love</h2>
          <a href="#">Discover homes</a>
        </div>

        <div className="home-carousel-wrapper">
          <button className="home-nav home-prev" onClick={() => scroll("prev")}>
            &#10094;
          </button>

          <div className="home-carousel" ref={carouselRef}>
            {data.map((item, index) => (
              <div className="home-card" key={index}>
                <div className="home-img-box">
                  <img src={item.img} alt={item.title} />
                  <span className="home-heart">♡</span>
                </div>

                <div className="home-card-body">
                  <h3>{item.title}</h3>
                  <div className="home-location">{item.location}</div>

                  <div className="home-rating-row">
                    <span className="home-rating-box">{item.rating}</span>

                    <div className="home-rating-info">
                      <span className="home-rating-text">
                        {item.ratingText}
                      </span>
                      {item.reviews && (
                        <span className="home-reviews">
                          {item.reviews}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="home-price-box">
                    <span>Starting from</span>
                    <h4>{item.price}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="home-nav home-next" onClick={() => scroll("next")}>
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomesSection;