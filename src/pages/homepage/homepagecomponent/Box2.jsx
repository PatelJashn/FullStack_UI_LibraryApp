import React from "react";
import "./box.css";

const Box2 = () => {
  const buttonShowcase = [
    {
      id: "sunset",
      tag: "gradient",
      title: "Sunset Primary",
      description: "Bold gradient CTA with soft glow shadow.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(255,94,247,0.25), rgba(2,245,255,0.18))",
        border: "1px solid rgba(255, 94, 247, 0.35)"
      },
      buttonStyle: {
        background: "linear-gradient(135deg, #FF5EF7, #02F5FF)",
        boxShadow: "0 15px 35px rgba(2, 245, 255, 0.4)"
      },
      label: "Get Started"
    },
    {
      id: "outline",
      tag: "outline",
      title: "Midnight Outline",
      description: "High-contrast outline button with inner glow.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16,16,32,0.85), rgba(52,49,96,0.6))",
        border: "1px solid rgba(130, 178, 255, 0.4)"
      },
      buttonStyle: {
        background: "transparent",
        color: "#a5b4fc",
        border: "1px solid rgba(165, 180, 252, 0.7)",
        boxShadow: "0 0 18px rgba(165, 180, 252, 0.35)"
      },
      label: "Night Mode"
    },
    {
      id: "pill",
      tag: "pill",
      title: "Velvet Pill",
      description: "Soft pill button with subtle drop shadow.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(244,114,182,0.15), rgba(14,165,233,0.15))",
        border: "1px solid rgba(244, 114, 182, 0.35)"
      },
      buttonStyle: {
        background: "#f472b6",
        color: "#fff",
        border: "none",
        borderRadius: "999px",
        boxShadow: "0 12px 25px rgba(244, 114, 182, 0.35)"
      },
      label: "Book Demo"
    },
    {
      id: "dual",
      tag: "split",
      title: "Dual Spectrum",
      description: "Split-tone button that flips color on hover.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(14,116,144,0.25))",
        border: "1px solid rgba(34, 211, 238, 0.35)"
      },
      buttonStyle: {
        background: "linear-gradient(90deg, #22d3ee 0%, #3b82f6 100%)",
        border: "none"
      },
      label: "Live Preview"
    }
  ];

  return (
    <div className="ui-grid">
      {buttonShowcase.map((design) => (
        <div className="ui-card" key={design.id} style={design.cardStyle}>
          <span className="ui-card-pill">{design.tag}</span>
          <h4>{design.title}</h4>
          <p>{design.description}</p>
          <button className="ui-preview-button" style={design.buttonStyle}>
            {design.label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Box2;
