import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "https://dhunobeats.com/api/hotel-login",
        {
          email: email,
          password: password,
        }
      );

      if (response.data.status === true) {
        // Save token and type
        localStorage.setItem("token", response.data.token);
        const userType = response.data.user.type;
        localStorage.setItem("type", userType);

        // Redirect based on type
        if (userType === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/host");
        }

        alert("Login Successful");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Network Error");
      }
    }

    setLoading(false);
  };

  return (
    <div className="login-login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <Link to="/" className="login-logo-name">
          Stay9jaHotel.com
        </Link>

        <h4 className="login-subtitle">SIGN IN TO CONTINUE</h4>

        {/* <button type="button" className="login-google-btn">
          <img src="https://hotels.ng/img/social/google.png" alt="google" />
          <span>Sign in with Google</span>
        </button> */}

        {/* <hr /> */}

        <div className="login-inputs">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-submit-btn">
            {loading ? "Processing..." : "Login"}
          </button>
        </div>

        <p className="login-extra-links">
          Forgot password? <span>Reset</span>
        </p>

        <p className="login-signin-text">
          Don't have an account?
          <Link to="/signup" className="login-link">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;