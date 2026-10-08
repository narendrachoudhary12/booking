import { API_BASE } from "../../config/api";
import React, { useState, useEffect } from "react";
import "./AboutFAQ.css";

const AboutFAQ = ({ slug }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/cityHotels/${slug}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch city data: ${res.status}`);
        }
        const json = await res.json();
        setCityData(json);
      } catch (err) {
        console.error("Fetch error:", err);
        setFetchError("Unable to load city information right now.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCityData();
    }
  }, [slug]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setError("Please fill required fields");
      return;
    }

    setSuccess("Your request was successful, You will receive an email shortly.");
    setError("");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="about-faq-container">

      {/* ABOUT SECTION */}
      <div className="about-section">
        {loading ? (
          <p>Loading...</p>
        ) : fetchError ? (
          <p className="error">{fetchError}</p>
        ) : (
          <>
            <h2>About {cityData?.city?.name}</h2>
            <p>{cityData?.city?.description}</p>
          </>
        )}
      </div>

      {/* FAQ SECTION */}
      <div className="faq-section">
        <h2>Frequently asked questions</h2>

        <div className="faq-grid">

          {/* FORM */}
          <div className="faq-form-card">
            <h3>Ask a question</h3>
            <p>Typically responds within 24 hours</p>

            <form onSubmit={handleSubmit}>

              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="phone"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={handleChange}
              />

              <textarea
                name="message"
                placeholder="Message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
              />

              <button type="submit">Submit</button>

              {success && <p className="success">{success}</p>}
              {error && <p className="error">{error}</p>}

            </form>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AboutFAQ;