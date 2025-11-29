import React from "react";
import "./box.css";

const Box3 = () => {
  const buttonShowcase = [
    {
      id: "glass",
      tag: "frosted",
      title: "Frost Wave",
      description: "Frosted glass button with aurora accent.",
      cardStyle: {
        background: "rgba(15,23,42,0.65)",
        border: "1px solid rgba(226, 232, 240, 0.2)",
        backdropFilter: "blur(18px)"
      },
      buttonStyle: {
        background: "rgba(255,255,255,0.08)",
        color: "#e2e8f0",
        border: "1px solid rgba(255,255,255,0.25)",
        boxShadow: "0 20px 35px rgba(15, 23, 42, 0.45)"
      },
      label: "Frost"
    },
    {
      id: "sunrise",
      tag: "warm",
      title: "Sunrise Glow",
      description: "Warm gradient CTA with embossed shadow.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(253,186,116,0.2), rgba(248,113,113,0.2))",
        border: "1px solid rgba(251, 113, 133, 0.35)"
      },
      buttonStyle: {
        background: "linear-gradient(135deg, #fbbf24, #f97316)",
        boxShadow: "0 12px 30px rgba(249, 115, 22, 0.35)"
      },
      label: "Sunrise"
    },
    {
      id: "wired",
      tag: "wired",
      title: "Wireframe",
      description: "Minimal wireframe button for skeleton states.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(15,23,42,0.7), rgba(15,23,42,0.4))",
        border: "1px dashed rgba(148, 163, 184, 0.4)"
      },
      buttonStyle: {
        background: "transparent",
        color: "#94a3b8",
        border: "1px dashed rgba(148, 163, 184, 0.8)",
        fontStyle: "italic",
        letterSpacing: "1px"
      },
      label: "Skeleton"
    },
    {
      id: "lux",
      tag: "luxury",
      title: "Luxe Gold",
      description: "High-end button with metallic sheen.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(28,28,32,0.95), rgba(45,45,58,0.7))",
        border: "1px solid rgba(255, 215, 141, 0.35)"
      },
      buttonStyle: {
        background: "linear-gradient(135deg, #FFD18D, #FFB347)",
        color: "#3f2510",
        boxShadow: "0 20px 40px rgba(255, 179, 71, 0.4)"
      },
      label: "Reserve"
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

export default Box3;
