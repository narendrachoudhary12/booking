import React from "react";
import "./GetApp.css";

const GetApp = () => {
  return (
    <section className="ga-section">
      <div className="ga-container">

        {/* Left Image */}
        <div className="ga-image">
          <img
            src="https://hotels.ng/img/hotelsng/app-image.png"
            alt="App Preview"
          />
        </div>

        {/* Right Content */}
        <div className="ga-content">
            <h2 className="ga-title">
                <span className="ga-small">Get the</span>
                <br />
                <span className="ga-highlight">Stay9jaHotels app</span>
            </h2>
          <h3 className="ga-subtitle">
            Download the Stay9jaHotels app and book a hotel instantly
            {/* Coming Soon on the App Store! Stay tuned. */}
          </h3>
          {/* <p className="ga-text">
            Book your hotel instantly with our Android and iOS Apps.
          </p> */}

          <div className="ga-buttons">
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
              />
            </a>

            <a
              href="#"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
              />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GetApp;