import React from "react";
import "./OfferBanner.css";

const OfferBanner = () => {
  return (
    <section className="offer-genius-banner">
      <h2>Offers</h2>
      <p>Promotions, deals, and special offers for you</p>

      <div className="offer-genius-wrapper">

        {/* Box 1 */}
        <div className="offer-genius-card">
          <div className="offer-genius-content">
            <h3>Sign in, save money</h3>
            <p>
              Save 10% or more at participating properties – just look for the blue Genius label
            </p>

            <div className="offer-genius-buttons">
              <a href="#" className="offer-btn offer-primary">
                Save with a Getaway Deal
              </a>
            </div>
          </div>

          <div className="offer-genius-image">
            <img
              src="https://q-xx.bstatic.com/xdata/images/xphoto/248x248/649262209.jpeg?k=c4d52e30a5c9fabd0821706902da43af8f09e2f8f987f7c5f2bbe0ff915ef0ac&o="
              alt="Offer 1"
            />
          </div>
        </div>

        {/* Box 2 */}
        <div className="offer-genius-card">
          <div className="offer-genius-content">
            <h3>Get exclusive deals</h3>
            <p>
              Enjoy special discounts on stays, flights, and more across the world
            </p>

            <div className="offer-genius-buttons">
              <a href="#" className="offer-btn offer-primary">
                Explore deals
              </a>
            </div>
          </div>

          <div className="offer-genius-image">
            <img
              src="https://r-xx.bstatic.com/xdata/images/xphoto/248x248/617102726.jpeg?k=53213209311f5bd09c92829da56d538bd77abbf521aae5658dc434a0ac448e1a&o="
              alt="Offer 2"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default OfferBanner;