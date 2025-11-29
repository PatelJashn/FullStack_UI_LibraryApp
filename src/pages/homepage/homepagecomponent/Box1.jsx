import React from "react";
import "./box.css";

const Box1 = () => {
  const buttonShowcase = [
    {
      id: "aurora",
      tag: "glass CTA",
      title: "Aurora Launch",
      description: "Glassmorphic gradient button for hero sections.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(76,0,255,0.25), rgba(0,229,255,0.15))",
        border: "1px solid rgba(120, 89, 255, 0.4)"
      },
      buttonStyle: {
        background: "linear-gradient(135deg, #6C63FF, #5EE7DF)",
        boxShadow: "0 12px 30px rgba(92, 71, 255, 0.45)"
      },
      label: "Launch"
    },
    {
      id: "neon",
      tag: "neon",
      title: "Cyber Pulse",
      description: "Holographic outline with soft teal glow.",
      cardStyle: {
        background: "radial-gradient(circle at top, rgba(0,200,255,0.2), rgba(0,0,0,0.4))",
        border: "1px solid rgba(0, 200, 255, 0.5)"
      },
      buttonStyle: {
        background: "transparent",
        color: "#74f0ff",
        border: "1px solid rgba(116, 240, 255, 0.6)",
        boxShadow: "0 0 25px rgba(116, 240, 255, 0.45)"
      },
      label: "Pulse"
    },
    {
      id: "mono",
      tag: "minimal",
      title: "Mono Ghost",
      description: "Monochrome ghost button for clean dashboards.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.08))",
        border: "1px solid rgba(255, 255, 255, 0.18)"
      },
      buttonStyle: {
        background: "rgba(255,255,255,0.05)",
        color: "#f8fafc",
        border: "1px solid rgba(255,255,255,0.25)"
      },
      label: "Try Demo"
    },
    {
      id: "retro",
      tag: "retro",
      title: "Pixel Pop",
      description: "Retro pixel button with chunky hover effect.",
      cardStyle: {
        background: "linear-gradient(135deg, rgba(255,111,97,0.35), rgba(255,206,84,0.2))",
        border: "1px solid rgba(255, 169, 64, 0.45)"
      },
      buttonStyle: {
        background: "#ff6f61",
        color: "#1b1b1f",
        border: "3px solid #ffb562",
        fontFamily: "'Press Start 2P', cursive",
        fontSize: "0.75rem"
      },
      label: "Insert Coin"
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

export default Box1;
