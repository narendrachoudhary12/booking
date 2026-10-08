import React, { useRef } from "react";
import "./UniqueProperties.css";

const UniqueProperties = () => {
  const carouselRef = useRef(null);

  const scroll = (dir) => {
    const cardWidth =
      carouselRef.current.querySelector(".unique-card").offsetWidth + 16;

    carouselRef.current.scrollBy({
      left: dir === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  const data = [
    {
      title: "Aparthotel Stare Miasto",
      location: "Owerri, Nigeria",
      rating: "8.8",
      ratingText: "Excellent",
      reviews: "(776 reviews)",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/280950287.webp?k=d5b9f77442fa93b93c86a720abebfe39a3f9532d4efa6a9cefa231a2ded6bd95&o=",
    },
    {
      title: "Leman Locke",
      location: "Maryland, Nigeria",
      rating: "8.3",
      ratingText: "Very Good",
      reviews: "",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/132452060.webp?k=f9cd3042175e0da40abf6d3988b9f3ac91aaeaefd9941081dbadfd0875c8ab27&o=",
    },
    {
      title: "Aparthotel Stare Miasto",
      location: "Abia, Nigeria",
      rating: "8.3",
      ratingText: "Very Good",
      reviews: "",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/187855604.webp?k=0abbcd2115938850aa3372f4e7bf847f2aeb9579d674ec40ff273230a840eb9d&o=",
    },
    {
      title: "Leman Locke",
      location: "Jos, Nigeria",
      rating: "8.8",
      ratingText: "Excellent",
      reviews: "(776 reviews)",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/531732579.webp?k=df9d17c4371175b0e4a60e390083280c837d5e94dacc7d9ae6db48728b5fb5ff&o=",
    },
  ];

  return (
    <section className="unique-homes-section">
      <div className="unique-container">
        <div className="unique-header">
          <h2>Stay at our top unique properties</h2>
        </div>

        <p className="unique-sub-text">
          From castles and villas to boats and igloos, we have it all
        </p>

        <div className="unique-carousel-wrapper">
          <button className="unique-nav unique-prev" onClick={() => scroll("prev")}>
            &#10094;
          </button>

          <div className="unique-carousel" ref={carouselRef}>
            {data.map((item, index) => (
              <div className="unique-card" key={index}>
                <div className="unique-img-box">
                  <img src={item.img} alt={item.title} />
                  <span className="unique-heart">♡</span>
                </div>

                <div className="unique-card-body">
                  <h3>{item.title}</h3>
                  <div className="unique-location">{item.location}</div>

                  <div className="unique-rating-row">
                    <span className="unique-rating-box">{item.rating}</span>

                    <div className="unique-rating-info">
                      <span className="unique-rating-text">
                        {item.ratingText}
                      </span>
                      {item.reviews && (
                        <span className="unique-reviews">{item.reviews}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="unique-nav unique-next" onClick={() => scroll("next")}>
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default UniqueProperties;