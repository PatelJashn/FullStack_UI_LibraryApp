import React from "react";
import { motion } from "framer-motion";

const CommunitySection = () => {
  const leaderboard = [
    { rank: 1, name: "John Doe", contributions: 250, avatar: "https://i.pravatar.cc/50?img=1" },
    { rank: 2, name: "Jane Smith", contributions: 190, avatar: "https://i.pravatar.cc/50?img=2" },
    { rank: 3, name: "Alice Johnson", contributions: 150, avatar: "https://i.pravatar.cc/50?img=3" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#0b0b0b",
        padding: "80px 20px",
        color: "white",
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap",
      }}
    >
      {/* Community Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "linear-gradient(135deg, #111, #222)",
          padding: "40px",
          borderRadius: "15px",
          width: "400px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#bbb",
          }}
        >
          🏆 Community Leaderboard
        </h2>
        <p style={{ color: "#888", fontSize: "14px", marginBottom: "15px" }}>Top contributors in the community</p>
        <div>
          {leaderboard.map((user) => (
            <motion.div
              key={user.rank}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "#1b1b1b",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)",
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{ borderRadius: "50%", width: "40px", height: "40px", border: "2px solid #444" }}
              />
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: "#ddd" }}>{user.name}</h3>
                <p style={{ color: "#aaa", fontSize: "12px" }}>Contributions: {user.contributions}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px #444" }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#222",
            color: "#ddd",
            border: "1px solid #444",
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "15px",
          }}
        >
          View All
        </motion.button>
      </motion.div>

      {/* Join Our Discord Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          background: "linear-gradient(135deg, #111, #222)",
          padding: "40px",
          borderRadius: "15px",
          width: "400px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ color: "limegreen", fontSize: "14px", marginRight: "5px" }}>●</span>
          <span style={{ color: "limegreen", fontSize: "14px" }}>376 online</span>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#ddd", textAlign: "center" }}>
          Join the Discord community!
        </h2>
        <p style={{ color: "#888", fontSize: "14px", textAlign: "center", marginBottom: "15px" }}>
          An open space for UI designers and developers
        </p>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px #444" }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#333",
            color: "#ddd",
            border: "1px solid #444",
            padding: "12px 24px",
            fontSize: "14px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
        >
          <span style={{ fontSize: "20px" }}>💬</span> Join Discord
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CommunitySection;
