import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo & About */}
        <div className="footer-section about">
          <h2 className="logo">UI Forge</h2>
          <p>Your go-to UI library for modern web design. Browse, copy, and create with ease.</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Browse</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="footer-section newsletter">
          <h3>Subscribe</h3>
          <p>Get updates on the latest UI components and designs.</p>
          <form>
            <input type="email" placeholder="Your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} UI Forge. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
