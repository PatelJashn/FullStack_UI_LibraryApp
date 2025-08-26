import React from "react";
import { useTheme } from "../../../components/ThemeContext";

const Part = () => {
  const { isDarkMode } = useTheme();

  const containerStyle = {
    fontSize: "40px",
    paddingRight: "300px",
    paddingLeft: "360px",
    paddingTop: "70px",
    paddingBottom: "70px",
    backgroundColor: isDarkMode ? "rgb(30, 28, 28)" : "#FAF9F6",
    fontFamily: "Arial, Helvetica, sans-serif",
    color: isDarkMode ? "aliceblue" : "#333333",
    borderBottom: isDarkMode ? "none" : "2px solid #000000",
  };

  const paragraphStyle = {
    fontSize: "16px",
    textAlign: "justify",
    color: isDarkMode ? "rgba(17, 233, 17, 0.768)" : "#1e40af",
    textDecoration: "underline",
  };

  const searchBarStyle = {
    display: "flex",
    alignItems: "center",
    marginTop: "60px",
    padding: "8px",
    backgroundColor: isDarkMode ? "#e2e8f0" : "#FAF9F6",
    borderRadius: "16px",
    boxShadow: isDarkMode ? "0 10px 15px rgba(0, 0, 0, 0.1)" : "0 4px 12px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.2s ease-in-out",
    border: isDarkMode ? "none" : "2px solid #000000",
  };

  const inputStyle = {
    flex: 1,
    padding: "12px 16px 12px 40px",
    fontSize: "20px",
    border: "none",
    borderRadius: "12px",
    backgroundColor: isDarkMode ? "#f8fafc" : "#FAF9F6",
    color: isDarkMode ? "#482d35" : "#333333",
    outline: "none",
  };

  const placeholderStyle = {
    color: "#a0aec0",
    fontSize: "14px",
  };

  const iconStyle = {
    position: "absolute",
    marginLeft: "16px",
    color: isDarkMode ? "#718096" : "#666666",
    pointerEvents: "none",
  };

  const buttonStyle = {
    marginLeft: "8px",
    padding: "12px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    color: "white",
    backgroundColor: isDarkMode ? "#3e0859ce" : "#1e40af",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "background-color 0.2s ease-in-out",
  };

  const buttonHoverStyle = {
    backgroundColor: isDarkMode ? "#4c51bf" : "#1e3a8a",
  };

  return (
    <div style={containerStyle}>
      <h1>The Ultimate UI Library of Open-Source UI</h1>
      <p style={paragraphStyle}>Community-built library of UI elements.</p>
      <p style={paragraphStyle}>Copy as HTML/CSS, Tailwind, React and Figma</p>

      <form style={searchBarStyle}>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search for components, styles, creators..."
          style={inputStyle}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={isDarkMode ? "#000000" : "#666666"}
          style={iconStyle}
        >
          <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
        </svg>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default Part;
