import React, { useRef } from "react";
import "./Deals.css";

const Deals = () => {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    const container = carouselRef.current;
    const card = container.querySelector(".deals-card");
    const cardWidth = card.offsetWidth + 16;

    container.scrollBy({
      left: direction === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  const hotels = [
    {
      name: "Aparthotel Stare Miasto",
      location: "Lagos, Nigeria",
      img: "https://cf.bstatic.com/xdata/images/hotel/square600/280950287.webp?k=d5b9f77442fa93b93c86a720abebfe39a3f9532d4efa6a9cefa231a2ded6bd95&o=",
      rating: "8.8",
      price: "₹36,530",
      oldPrice: "₹50,000",
    },
    {
      name: "Hotel Iconic Platinum",
      location: "Calabar, Nigeria",
      img: "https://cf.bstatic.com/xdata/images/hotel/square240/835104494.jpg?k=71ea96d1348498217913e66a34715392df82cc8d5f279e716adfc9e59d93f6e2&o=",
      rating: "8.5",
      price: "₹28,999",
      oldPrice: "₹40,000",
    },
    {
      name: "Limewood Stay Studio",
      location: "Abuja, Nigeria",
      img: "https://cf.bstatic.com/xdata/images/hotel/square240/529316609.jpg?k=d591181dfb3131912c790d7b0e24825e7890bdd03f3dafd7b5c59e735dca041e&o=",
      rating: "8.2",
      price: "₹19,999",
      oldPrice: "₹30,000",
    },
    {
      name: "Lake Facing Resort",
      location: "Ikoyi, Nigeria",
      img: "https://cf.bstatic.com/xdata/images/hotel/square240/478272580.jpg?k=f80ef48bdcb3db43517bf7d5bf8caf0507c20e43be21c182d44004c14feefbff&o=",
      rating: "9.0",
      price: "₹45,000",
      oldPrice: "₹60,000",
    },
  ];

  return (
    <section className="deals-homes-section">
      <div className="deals-container">
        <div className="deals-header">
          <h2>Looking for the perfect stay?</h2>
        </div>

        <div className="deals-carousel-wrapper">
          <button className="deals-nav deals-prev" onClick={() => scroll("prev")}>
            &#10094;
          </button>

          <div className="deals-carousel" ref={carouselRef}>
            {hotels.map((hotel, index) => (
              <div className="deals-card" key={index}>
                <div className="deals-img-box">
                  <img src={hotel.img} alt={hotel.name} />
                  <span className="deals-heart">♡</span>
                </div>

                <div className="deals-rating-row-genius">
                  <span className="deals-rating-box">Genius</span>
                </div>

                <div className="deals-card-body">
                  <h3>{hotel.name}</h3>
                  <div className="deals-location">{hotel.location}</div>

                  <div className="deals-rating-row">
                    <span className="deals-rating-box">{hotel.rating}</span>
                    <div className="deals-rating-info">
                      <span className="deals-rating-text">Excellent</span>
                      <span className="deals-reviews">(500+ reviews)</span>
                    </div>
                  </div>

                  <div className="deals-price-box-sell">
                    <span className="deals-start">Starting from</span>
                    <h4 className="deals-old-price">
                      <del>{hotel.oldPrice}</del>
                    </h4>
                    <h4 className="deals-new-price">{hotel.price}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="deals-nav deals-next" onClick={() => scroll("next")}>
            &#10095;
          </button>
        </div>
      </div>
    </section>
  );
};

export default Deals;