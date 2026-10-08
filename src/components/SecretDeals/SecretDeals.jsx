import React, { useState } from "react";
import "./SecretDeals.css";

const SecretDeals = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    <section className="sd-deals-section">
      <div className="sd-deals-box">
        <h3 className="sp-title">Special Hotel Deals and Offers</h3>
        <p className="sp-subtitle">Enter your email address to receive secret hotels deals</p>

        <div className="sd-input-group">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button onClick={handleSubmit}>Subscribe</button>
        </div>
      </div>
    </section>
  );
};

export default SecretDeals;