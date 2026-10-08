import React from "react";
import './AddHotel.css';

function AddHotel({ hotel }) {

  const FAQS = [
    { q: `Does ${hotel?.name} offer free Wi-Fi?`, a: "Yes, it offers free Wi-Fi." },
    { q: `Does ${hotel?.name} have a swimming pool?`, a: "Yes, it has a swimming pool." },
    { q: `Does ${hotel?.name} offer breakfast?`, a: "Yes, it offers breakfast." },
    { q: `Is there a gym at ${hotel?.name}?`, a: "Yes, there is a gym." },
    { q: `Does ${hotel?.name} have a restaurant?`, a: "Yes, it has a restaurant." },
  ];

  return (
    <div className="addHotel-page">
      
      {/* LEFT FAQ SECTION (old style restored) */}
      <div className="addHotel-left">

        <div className="addHotel-faq-box">
          <h3>Frequently Asked Questions</h3>

          {FAQS.map((f, i) => (
            <div key={i} className="addHotel-faq-item">
              <div className="addHotel-q">{f.q}</div>
              <div className="addHotel-a">{f.a}</div>
            </div>
          ))}
        </div>

      </div>

      {/* RIGHT FORM SECTION */}
      <div className="addHotel-right">
        <div className="addHotel-form-card">

          <h2>Register Your Hotel</h2>

          {/* HOTEL INFORMATION */}
          <h3 className="addHotel-section-title">Hotel Information</h3>

          <input type="text" placeholder="Hotel Name" />
          <input type="email" placeholder="Hotel Email" />

          <div className="addHotel-row">
            <input type="text" placeholder="Country Code (+91)" />
            <input type="text" placeholder="Phone Number" />
          </div>

          <input type="text" placeholder="Website URL" />
          <input type="text" placeholder="Location" />
          <input type="text" placeholder="City" />
          <textarea placeholder="Address"></textarea>

          {/* PERSONAL INFORMATION */}
          <h3 className="addHotel-section-title">Personal Information</h3>

          <input type="text" placeholder="Full Name" />
          <input type="email" placeholder="Email Address" />

          <button>Add Your Hotel</button>

          <p className="addHotel-note">
            We will contact you within 24 hours after submission.
          </p>

        </div>
      </div>

    </div>
  );
}

export default AddHotel;