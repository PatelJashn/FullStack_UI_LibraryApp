import React, { useState } from "react";
import { motion } from "framer-motion";

const BrowseAndAddSection = () => {
  const tags = [
    "button", "card", "form", "input", "label", "modal", "tooltip", "dropdown", "table", "checkbox",
    "radio", "switch", "avatar", "badge", "breadcrumb", "carousel", "pagination", "progress", "spinner", "tabs",
    "toast", "accordion", "alert", "banner", "dialog", "divider", "grid", "icon", "image", "list",
    "menu", "popover", "rating", "slider", "stepper", "timeline", "tree", "video", "widget", "loader"
  ];

  const duplicatedTags = [...tags, ...tags, ...tags]; // Tripling for smooth transition

  const containerStyle = {
    backgroundColor: "#111",
    color: "white",
    padding: "60px 20px",
    textAlign: "center",
    overflow: "hidden",
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
    color: "#aaa",
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
    background: "#222",
    padding: "10px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#ccc",
    cursor: "pointer",
    transition: "0.3s ease",
  };

  const sectionWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "50px",
  };

  const boxStyle = {
    background: "linear-gradient(135deg, #222, #333)",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.3s ease-in-out",
    flex: "1",
    minWidth: "250px",
  };

  const buttonStyle = {
    background: "#282928",
    color: "white",
    border: "none",
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s ease",
    border: "1px solid white",
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
                background: hoveredTag === index ? "#444" : "#222",
                color: hoveredTag === index ? "#fff" : "#ccc",
                transform: hoveredTag === index ? "scale(1.1)" : "scale(1)",
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
          <p style={{ color: "#bbb", fontSize: "16px", marginBottom: "20px" }}>
            Contribute your UI elements & showcase your creativity!
          </p>
          <button
            style={{
              ...buttonStyle,
              background: "#282928",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#3a3b3a")}
            onMouseLeave={(e) => (e.target.style.background = "#282928")}
          >
            Add UI
          </button>
        </div>

        {/* BROWSE ALL CATEGORIES */}
        <div style={boxStyle}>
          <h2>📂 BROWSE ALL CATEGORIES</h2>
          <p style={{ color: "#bbb", fontSize: "16px", marginBottom: "20px" }}>
            Discover a wide range of UI elements from various categories.
          </p>
          <button
            style={{
              ...buttonStyle,
              background: "#282928",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#3a3b3a")}
            onMouseLeave={(e) => (e.target.style.background = "#282928")}
          >
            Explore Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrowseAndAddSection;
