import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

const countries = [
  { name: "India", code: "+91", flag: "https://flagcdn.com/w320/in.png" },
  { name: "Nigeria", code: "+234", flag: "https://flagcdn.com/w320/ng.png" },
  { name: "USA", code: "+1", flag: "https://flagcdn.com/w320/us.png" },
  { name: "UK", code: "+44", flag: "https://flagcdn.com/w320/gb.png" },
];

const Signup = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phone, setPhone] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://dhunobeats.com/api/hotel-register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            last_name: formData.last_name,
            email: formData.email,
            phone: phone.replace(selectedCountry.code, "").trim(),
            password: formData.password,
            confirm_password: formData.confirm_password,
          }),
        }
      );

      const data = await response.json();

      if (data.status) {
        alert("Registration Successful ✅");

        // Reset form
        setFormData({
          name: "",
          last_name: "",
          email: "",
          password: "",
          confirm_password: "",
        });
        setPhone("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form className="form" onSubmit={handleSubmit}>
        
        <Link to="/" className="logo-name">
          Stay9jaHotel.com
        </Link>

        <h5 className="subtitle">SIGN UP TO CONTINUE</h5>

        {/* Inputs */}
        <div className="inputs">

          <input
            type="text"
            name="name"
            placeholder="First Name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            required
            value={formData.last_name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            required
            value={formData.email}
            onChange={handleChange}
          />

          {/* Phone */}
          <div className="phone-group">
            <div className="dropdownn">
              <img src={selectedCountry.flag} alt="" />
              <select
                onChange={(e) => {
                  const country = countries[e.target.selectedIndex];
                  setSelectedCountry(country);
                  setPhone(country.code + " ");
                }}
              >
                {countries.map((c, i) => (
                  <option key={i}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm password"
            required
            value={formData.confirm_password}
            onChange={handleChange}
          />

          <button className="submit-btn" disabled={loading}>
            {loading ? "Processing..." : "Register Now"}
          </button>
        </div>

        <p className="signin-text">
          Already have an account?
          <Link to="/login" className="login-link">
            Sign in
          </Link>
        </p>

      </form>
    </div>
  );
};

export default Signup;