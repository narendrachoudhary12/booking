import React, { useState } from "react";
import "./UnlockDeals.css";

const UnlockDeals = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = () => {
    if (!email) {
      setMessage("Please enter your email");
      return;
    }

    // Dummy success (later API connect kar sakte ho)
    setMessage("Deals unlocked successfully!");
    setEmail("");
  };

  return (
    <section className="ud-container">
      <div className="ud-wrapper">

        {/* Left Content */}
        <div className="ud-left">
          <div className="ud-icon">🔒</div>

          <div>
            <h3>Enter your email address to unlock hotel deals</h3>
            <p>Sign up to start receiving exclusive offers</p>
          </div>
        </div>

        {/* Right Form */}
        <div className="ud-right">
          <div className="ud-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={handleSubscribe}>Unlock</button>
          </div>

          {message && <span className="ud-message">{message}</span>}
        </div>

      </div>
    </section>
  );
};

export default UnlockDeals;