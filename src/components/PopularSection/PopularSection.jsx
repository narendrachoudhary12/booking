import React, { useState } from "react";
import "./PopularSection.css";

const PopularSection = () => {
  const [activeTab, setActiveTab] = useState("domestic");

  const tabs = [
    { id: "domestic", label: "Domestic cities" },
    { id: "international", label: "International cities" },
    { id: "regions", label: "Regions" },
    { id: "countries", label: "Countries" },
    { id: "places", label: "Places to stay" },
  ];

  const tabData = {
    domestic: [
      "Ooty hotels", "Jaipur hotels", "Mumbai hotels", "Udaipur hotels",
      "Varanasi hotels", "Rishikesh hotels", "Goa hotels", "Shimla hotels",
      "Manali hotels", "Delhi hotels"
    ],
    international: [
      "Dubai hotels", "Bangkok hotels", "Singapore hotels", "London hotels",
      "Paris hotels", "New York hotels", "Bali hotels", "Tokyo hotels",
      "Sydney hotels", "Rome hotels"
    ],
    regions: [
      "Goa Region", "Kerala Region", "Rajasthan Region", "Himachal Region",
      "Kashmir Region", "Uttarakhand Region", "Punjab Region", "Gujarat Region",
      "Tamil Nadu Region", "North East Region"
    ],
    countries: [
      "India hotels", "UAE hotels", "Thailand hotels", "Singapore hotels",
      "France hotels", "USA hotels", "Italy hotels", "Japan hotels",
      "Australia hotels", "Indonesia hotels"
    ],
    places: [
      "Resorts", "Apartments", "Villas", "Hostels", "Guest Houses",
      "Homestays", "Cottages", "Luxury Hotels", "Budget Hotels", "Beach Resorts"
    ]
  };

  const categories = [
    "Countries", "Regions", "Cities", "Districts", "Airports", "Hotels",
    "Places of interest", "Vacation Homes", "Apartments", "Resorts",
    "Villas", "Hostels", "B&Bs", "Guest Houses", "Unique places to stay",
    "All destinations", "All flight destinations", "All car rental locations",
    "All vacation destinations", "Guides", "Discover", "Discover monthly stays"
  ];

  return (
    <section className="popular-section">
      <h2>Popular with travelers from Nigeria</h2>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content active">
        {tabData[activeTab].map((item, index) => (
          <a key={index} href="#">
            {item}
          </a>
        ))}
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map((item, index) => (
          <a key={index} href="#">
            {item}
          </a>
        ))}
      </div>
    </section>
  );
};

export default PopularSection;