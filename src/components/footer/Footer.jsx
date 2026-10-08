import React from "react";
import { BrowserRouter, Routes, Route, NavLink ,Link} from 'react-router-dom';
import "./Footer.css"; // optional if you want styling

//Stay9jaHotelsTermsOfService
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-row">

            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                {/* <li><Link to='/about'>About us</Link></li> */}
                {/* <li><Link to='/signup'>Register</Link></li> */}
                {/* <li><Link to='/hotels'>Hotel</Link></li>
                <li><Link to='/hotel-details'>Hotel Detsils</Link></li> */}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Terms and settings</h4>
              <ul>
                <li><Link to='/Stay9jaHotelsTermsOfService'>Terms Of Service</Link></li>
                <li><Link to='/Stay9jaHotelsPrivacyCookiePolicy'>Privacy Policy</Link></li>
                {/* <li><a href="#">Travel articles</a></li>
                <li><a href="#">stay9jahotels.com for Business</a></li>
                <li><a href="#">Traveller Review Awards</a></li>
                <li><a href="#">Car rental</a></li>
                <li><a href="#">Flight finder</a></li>
                <li><a href="#">Restaurant reservations</a></li>
                <li><a href="#">stay9jahotels.com for Travel Agents</a></li> */}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Discover</h4>
              <ul>
                {/* <li><a href="#">Privacy & cookies</a></li>
                <li><a href="#">Terms and conditions</a></li>
                <li><a href="#">Accessibility</a></li>
                <li><a href="#">Grievance officer</a></li>
                <li><a href="#">Modern Slavery Statement</a></li>
                <li><a href="#">Human Rights Statement</a></li> */}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Partners</h4>
              <ul>
                {/* <li><a href="#">Extranet login</a></li>
                <li><a href="#">Partner help</a></li>
                <li><a href="#">List your property</a></li>
                <li><a href="#">Become an affiliate</a></li> */}
              </ul>
            </div>

            <div className="footer-col">
              <h4>About</h4>
              <ul>
                {/* <li><a href="#">About Us</a></li>
                <li><a href="#">How We Work</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Press center</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Investor relations</a></li>
                <li><a href="#">Corporate contact</a></li>
                <li><a href="#">Content guidelines and reporting</a></li> */}
              </ul>
            </div>

          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          Stay9jahotels is part of EP Hotel Centric Ltd, the world leader in online travel and related services.
        </p>
        <p>
          Copyright © 1996–2026 Stay9jaHotels ™. All rights reserved.
        </p>

        {/* <div className="logo-row">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/Booking.com_logo.svg" alt="Booking" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Priceline_Logo.svg" alt="Priceline" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Agoda_logo.svg" alt="Agoda" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Kayak_Logo.svg" alt="Kayak" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6e/OpenTable_logo.svg" alt="OpenTable" />
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;