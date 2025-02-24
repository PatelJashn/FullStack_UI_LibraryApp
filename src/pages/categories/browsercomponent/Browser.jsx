import React from "react";
import "./browse.css"; // if it's two levels up

export default function Buttons() {
  // Sample data for the grid section to avoid repeating code
  const gridItems = ["Mukesh", "Mukesh", "Mukesh"];

  return (
    <div className="body">
      {/* Navigation Bar */}
      <nav className="jashn">
        <h3>
          <span className="uiiii">𝗨𝗜</span>ᴠᴇʿsᴇ
        </h3>
        <ul className="flex">
          <li className="Element">
            Element
            <div className="dropdown dark-theme">
              <ul>
                <li>All</li>
                <li>Checkboxes <span className="count">270</span></li>
                <li>Cards <span className="count">1168</span></li>
                <li>Inputs <span className="count">302</span></li>
                <li>Forms <span className="count">234</span></li>
                <li>Patterns <span className="count">177</span></li>
                <li className="new-item">
                  Tooltips <span className="new">New</span>
                  <span className="count">112</span>
                </li>
                <li>Toggle Switches <span className="count">371</span></li>
                <li>Loaders <span className="count">961</span></li>
                <li>Radio Buttons <span className="count">154</span></li>
                <li>My Favorites</li>
              </ul>
            </div>
          </li>
          <li className="Element1">Challenges</li>
          <li className="Element1">Spotlight</li>
          <li className="Element1">Blog</li>
        </ul>
        <button className="nora"><span>+ Create</span></button>
        <button className="nora1">Join the Community</button>
      </nav>

      {/* Header Section */}
      <header className="first">
        <h1>Checkboxes</h1>
        <p>Open-Source checkboxes made with CSS or Tailwind</p>
      </header>

      {/* Filter Navigation */}
      <nav className="nav">
        <button className="paddi">All</button>
        <button className="paddi">Tailwind</button>
        <button className="paddi">CSS</button>
        <button className="paddi">Sort: Randomized</button>
        <button className="paddi">Any Theme</button>
        <input type="text" className="ppacemm" placeholder="Type here..." />
        <button className="searchhh">Search</button>
      </nav>

      {/* Grid Section */}
      <div className="Mukesh">
        {gridItems.map((item, index) => (
          <div key={index} className="widt">
            <p>{item}</p>
          </div>
        ))}
      </div>

      <br />

      {/* Repeat the grid with different sets of data */}
      <div className="Mukesh">
        {gridItems.map((item, index) => (
          <div key={index} className="widt">
            <p>{item}</p>
          </div>
        ))}
      </div>

      {/* Add More Sections Dynamically */}
      <div className="Mukesh">
        <div className="widt">
          <a className="btn" href="#">I am a button</a>
        </div>
        <div className="widt">
          <button className="button">
            <span className="label">+ Add to card</span>
            <span className="gradient-container">
              <span className="gradient"></span>
            </span>
          </button>
        </div>
        <div className="widt">
          <p>Mukesh</p>
        </div>
      </div>
    </div>
  );
}
