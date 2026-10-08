import React from "react";
import "./GeniusBanner.css"; 

const GeniusBanner = () => {
  return (
    <section className="genius-banner">
      <h2>Travel more, spend less</h2>

      <div className="genius-box">
        
        {/* Left Content */}
        <div className="genius-content">
          <h3>Sign in and save money</h3>
          <p>
            Save 10% or more at participating properties — just look for the blue Genius label.
          </p>

          <div className="genius-buttons">
            <a href="#" className="btn primary">Sign In</a>
            <a href="#" className="btn secondary">Register</a>
          </div>
        </div>

        {/* Right Image */}
        <div className="genius-image">
          <img
            src="https://t-cf.bstatic.com/design-assets/assets/v3.176.0/illustrations-traveller/GeniusGenericGiftBox.png"
            alt="Genius Offer"
          />
        </div>

      </div>
    </section>
  );
};

export default GeniusBanner;