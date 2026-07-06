import React from "react";
import "./Footer.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-top-bar" />
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo} alt="CraveCart" className="footer-logo" />
          <p>
            Delivering happiness one meal at a time. Fresh ingredients, expert
            chefs, and lightning-fast delivery — that's the CraveCart promise.
          </p>
          <div className="footer-social-icons">
            <a href="#" aria-label="Facebook">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>

        <div className="footer-content-center">
          <h3>Company</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Delivery</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-content-right">
          <h3>Get in touch</h3>
          <ul>
            <li>
              <span className="footer-contact-icon">📞</span>
              +1 (800) CRAVE-CART
            </li>
            <li>
              <span className="footer-contact-icon">✉️</span>
              support@cravecart.com
            </li>
            <li>
              <span className="footer-contact-icon">📍</span>
              San Francisco, CA
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p>© 2024 CraveCart — All Rights Reserved.</p>
        <p className="footer-bottom-links">
          <a href="#">Terms</a> · <a href="#">Privacy</a> · <a href="#">Cookies</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
