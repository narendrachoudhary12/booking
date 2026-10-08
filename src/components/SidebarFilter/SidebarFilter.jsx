import React, { useState } from "react";
import "./SidebarFilter.css";

const SidebarFilter = () => {
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState([0, 55000]);

  const handleSubscribe = () => {
    if (!email) return alert("Enter email");
    alert(`Subscribed: ${email}`);
  };

  const handleBudgetChange = (e, index) => {
    const value = Number(e.target.value);
    const newBudget = [...budget];
    newBudget[index] = value;
    setBudget(newBudget);
  };

  return (
    <aside className="sidebar">

      {/* Email Subscription */}
      <div className="card">
        <label className="title">Stay updated with our latest rates</label>

        <div className="email-box">
          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSubscribe}>Subscribe</button>
        </div>
      </div>

      {/* Property Type */}
      <div className="card">
        <h4>Property Type</h4>

        <label className="checkbox">
          <input type="checkbox" defaultChecked />
          Hotels
        </label>

        <label className="checkbox">
          <input type="checkbox" />
          Shortlet apartments
        </label>
      </div>

      {/* Budget */}
      <div className="card">
        <h4>Budget (per night)</h4>

        <p className="range-text">
          ₹{budget[0]} - ₹{budget[1]}
        </p>

        <div className="range-inputs">
          <input
            type="range"
            min="0"
            max="55000"
            value={budget[0]}
            onChange={(e) => handleBudgetChange(e, 0)}
          />
          <input
            type="range"
            min="0"
            max="55000"
            value={budget[1]}
            onChange={(e) => handleBudgetChange(e, 1)}
          />
        </div>

        <button className="primary-btn">Refine Search</button>
      </div>

      {/* Price Ranges */}
      <div className="card">
        <h4>Price Range</h4>

        {[
          "0 - 24,000",
          "24,000 - 55,000",
          "55,000+",
        ].map((item, i) => (
          <label key={i} className="checkbox">
            <input type="checkbox" />
            ₹{item}
          </label>
        ))}

        <button className="primary-btn">Refine</button>
      </div>

      {/* Amenities */}
      <div className="card">
        <h4>Amenities</h4>

        {[
          "Bar and Lounge",
          "Swimming Pool",
          "Restaurant",
          "WiFi",
          "Gym",
        ].map((item, i) => (
          <label key={i} className="checkbox">
            <input type="checkbox" />
            {item}
          </label>
        ))}
      </div>

      {/* Areas */}
      <div className="card">
        <h4>Select Area</h4>

        {[
          "Ikeja",
          "Lekki",
          "Victoria Island",
          "Ikoyi",
          "Surulere",
        ].map((area, i) => (
          <label key={i} className="checkbox">
            <input type="checkbox" />
            {area}
          </label>
        ))}
      </div>

    </aside>
  );
};

export default SidebarFilter;