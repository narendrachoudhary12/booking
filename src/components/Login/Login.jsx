import { API_BASE } from "../../config/api";
import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { dashboardPath, isLoggedIn, setSession } from "../../utils/auth";
import "./Login.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE}/hotel-login`,
        {
          email: email,
          password: password,
        }
      );

      if (response.data.status === true) {
        setSession(response.data);

        // Back to the page that sent them here, else their dashboard
        const userType = response.data.user?.type;
        const from = location.state?.from;
        const target =
          from && (userType === "admin" || !from.startsWith("/admin"))
            ? from
            : dashboardPath(userType);
        navigate(target, { replace: true });
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

  if (isLoggedIn() && !loading) {
    return <Navigate to={dashboardPath()} replace />;
  }

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