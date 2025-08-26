import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../components/ThemeContext";

const BrowseAndAddSection = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  
  const tags = [
    "button", "card", "form", "input", "label", "modal", "tooltip", "dropdown", "table", "checkbox",
    "radio", "switch", "avatar", "badge", "breadcrumb", "carousel", "pagination", "progress", "spinner", "tabs",
    "toast", "accordion", "alert", "banner", "dialog", "divider", "grid", "icon", "image", "list",
    "menu", "popover", "rating", "slider", "stepper", "timeline", "tree", "video", "widget", "loader"
  ];

  const duplicatedTags = [...tags, ...tags, ...tags]; // Tripling for smooth transition

  const containerStyle = {
    backgroundColor: isDarkMode ? "#111" : "#FAF9F6",
    color: isDarkMode ? "white" : "#333333",
    padding: "60px 20px",
    textAlign: "center",
    overflow: "hidden",
    borderTop: isDarkMode ? "none" : "2px solid #000000",
    borderBottom: isDarkMode ? "none" : "2px solid #000000",
  };

  const statsSectionStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "80px",
    marginBottom: "50px",
  };

  const statStyle = {
    fontSize: "36px",
    fontWeight: "bold",
  };

  const statTextStyle = {
    color: isDarkMode ? "#aaa" : "#666666",
    fontSize: "14px",
  };

  const browseTitleStyle = {
    fontSize: "22px",
    marginBottom: "20px",
  };

  const tagsWrapperStyle = {
    display: "flex",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
    gap: "12px",
  };

  const tagStyle = {
    background: isDarkMode ? "#222" : "#FAF9F6",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    color: isDarkMode ? "#ccc" : "#333333",
    cursor: "pointer",
    transition: "0.3s ease",
    border: isDarkMode ? "none" : "2px solid #000000",
    boxShadow: isDarkMode ? "none" : "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const sectionWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "50px",
  };

  const boxStyle = {
    background: isDarkMode ? "linear-gradient(135deg, #222, #333)" : "#FAF9F6",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: isDarkMode ? "0px 4px 10px rgba(0, 0, 0, 0.3)" : "0px 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.3s ease-in-out",
    flex: "1",
    minWidth: "250px",
    border: isDarkMode ? "none" : "2px solid #000000",
  };

  const buttonStyle = {
    background: isDarkMode ? "#282928" : "#1e40af",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s ease",
  };

  const [hoveredTag, setHoveredTag] = useState(null);

  return (
    <div style={containerStyle}>
      {/* Stats Section */}
      <div style={statsSectionStyle}>
        <div>
          <h2 style={statStyle}>5,950</h2>
          <p style={statTextStyle}>Community-made UI elements</p>
        </div>
        <div>
          <h2 style={statStyle}>100%</h2>
          <p style={statTextStyle}>Free for personal and commercial use</p>
        </div>
        <div>
          <h2 style={statStyle}>147,510</h2>
          <p style={statTextStyle}>Contributors to the community</p>
        </div>
      </div>

      {/* Browse UI Elements Section */}
      <h3 style={browseTitleStyle}>Browse UI Elements</h3>
      
      {/* Smooth Infinite Scrolling */}
      <div style={{ overflow: "hidden", width: "100%" }}>
        <motion.div
          style={tagsWrapperStyle}
          animate={{ x: ["0%", "-50%"] }} // Moves only 50% for seamless looping
          transition={{ ease: "linear", duration: 40, repeat: Infinity }} // Slower and smoother
        >
          {duplicatedTags.map((tag, index) => (
            <span
              key={index}
              style={{
                ...tagStyle,
                background: hoveredTag === index 
                  ? (isDarkMode ? "#444" : "#f3f4f6") 
                  : (isDarkMode ? "#222" : "#FAF9F6"),
                color: hoveredTag === index 
                  ? (isDarkMode ? "#fff" : "#1a1a1a") 
                  : (isDarkMode ? "#ccc" : "#333333"),
                transform: hoveredTag === index ? "scale(1.1)" : "scale(1)",
                border: hoveredTag === index 
                  ? (isDarkMode ? "none" : "2px solid #1e40af") 
                  : (isDarkMode ? "none" : "2px solid #000000"),
                boxShadow: hoveredTag === index 
                  ? (isDarkMode ? "none" : "0 4px 12px rgba(30, 64, 175, 0.2)") 
                  : (isDarkMode ? "none" : "0 2px 4px rgba(0, 0, 0, 0.1)"),
              }}
              onMouseEnter={() => setHoveredTag(index)}
              onMouseLeave={() => setHoveredTag(null)}
            >
              {tag}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Add UI & Browse Categories Section */}
      <div style={sectionWrapperStyle}>
        {/* ADD YOUR OWN UI */}
        <div style={boxStyle}>
          <h2>🚀 ADD YOUR OWN UI</h2>
          <p style={{ color: isDarkMode ? "#bbb" : "#666666", fontSize: "16px", marginBottom: "20px" }}>
            Contribute your UI elements & showcase your creativity!
          </p>
          <button
            style={{
              ...buttonStyle,
              background: isDarkMode ? "#282928" : "#1e40af",
            }}
            onMouseEnter={(e) => (e.target.style.background = isDarkMode ? "#3a3b3a" : "#1e3a8a")}
            onMouseLeave={(e) => (e.target.style.background = isDarkMode ? "#282928" : "#1e40af")}
            onClick={() => navigate('/upload')}
          >
            Add UI
          </button>
        </div>

        {/* BROWSE ALL CATEGORIES */}
        <div style={boxStyle}>
          <h2>📂 BROWSE ALL CATEGORIES</h2>
          <p style={{ color: isDarkMode ? "#bbb" : "#666666", fontSize: "16px", marginBottom: "20px" }}>
            Discover a wide range of UI elements from various categories.
          </p>
          <button
            style={{
              ...buttonStyle,
              background: isDarkMode ? "#282928" : "#1e40af",
            }}
            onMouseEnter={(e) => (e.target.style.background = isDarkMode ? "#3a3b3a" : "#1e3a8a")}
            onMouseLeave={(e) => (e.target.style.background = isDarkMode ? "#282928" : "#1e40af")}
            onClick={() => navigate('/categories')}
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseAndAddSection;
