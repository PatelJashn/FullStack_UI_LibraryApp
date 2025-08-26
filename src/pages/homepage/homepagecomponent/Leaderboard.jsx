import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../../components/ThemeContext";

const CommunitySection = () => {
  const { isDarkMode } = useTheme();

  const leaderboard = [
    { rank: 1, name: "John Doe", contributions: 250, avatar: "https://i.pravatar.cc/50?img=1" },
    { rank: 2, name: "Jane Smith", contributions: 190, avatar: "https://i.pravatar.cc/50?img=2" },
    { rank: 3, name: "Alice Johnson", contributions: 150, avatar: "https://i.pravatar.cc/50?img=3" },
  ];

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? "#0b0b0b" : "#FAF9F6",
        padding: "80px 20px",
        color: isDarkMode ? "white" : "#333333",
        display: "flex",
        justifyContent: "center",
        gap: "30px",
        flexWrap: "wrap",
        borderTop: isDarkMode ? "none" : "2px solid #000000",
      }}
    >
      {/* Community Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: isDarkMode ? "linear-gradient(135deg, #111, #222)" : "#FAF9F6",
          padding: "40px",
          borderRadius: "15px",
          width: "400px",
          boxShadow: isDarkMode ? "0px 4px 20px rgba(0, 0, 0, 0.5)" : "0px 4px 20px rgba(0, 0, 0, 0.08)",
          border: isDarkMode ? "none" : "2px solid #000000",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: isDarkMode ? "#bbb" : "#1a1a1a",
          }}
        >
          🏆 Community Leaderboard
        </h2>
        <p style={{ color: isDarkMode ? "#888" : "#666666", fontSize: "14px", marginBottom: "15px" }}>Top contributors in the community</p>
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
                background: isDarkMode ? "#1b1b1b" : "#FAF9F6",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                boxShadow: isDarkMode ? "0px 2px 10px rgba(0, 0, 0, 0.3)" : "0px 2px 8px rgba(0, 0, 0, 0.06)",
                border: isDarkMode ? "none" : "1px solid #000000",
              }}
            >
              <img
                src={user.avatar}
                alt={user.name}
                style={{ 
                  borderRadius: "50%", 
                  width: "40px", 
                  height: "40px", 
                  border: isDarkMode ? "2px solid #444" : "2px solid #000000" 
                }}
              />
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "bold", color: isDarkMode ? "#ddd" : "#333333" }}>{user.name}</h3>
                <p style={{ color: isDarkMode ? "#aaa" : "#666666", fontSize: "12px" }}>Contributions: {user.contributions}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: isDarkMode ? "0px 0px 15px #444" : "0px 0px 15px rgba(30, 64, 175, 0.3)" }}
          transition={{ duration: 0.3 }}
          style={{
            background: isDarkMode ? "#222" : "#1e40af",
            color: isDarkMode ? "#ddd" : "white",
            border: isDarkMode ? "1px solid #444" : "1px solid #1e40af",
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
          background: isDarkMode ? "linear-gradient(135deg, #111, #222)" : "#FAF9F6",
          padding: "40px",
          borderRadius: "15px",
          width: "400px",
          boxShadow: isDarkMode ? "0px 4px 20px rgba(0, 0, 0, 0.5)" : "0px 4px 20px rgba(0, 0, 0, 0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: isDarkMode ? "none" : "2px solid #000000",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
          <span style={{ color: "limegreen", fontSize: "14px", marginRight: "5px" }}>●</span>
          <span style={{ color: "limegreen", fontSize: "14px" }}>376 online</span>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: isDarkMode ? "#ddd" : "#1a1a1a", textAlign: "center" }}>
          Join the Discord community!
        </h2>
        <p style={{ color: isDarkMode ? "#888" : "#666666", fontSize: "14px", textAlign: "center", marginBottom: "15px" }}>
          An open space for UI designers and developers
        </p>
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: isDarkMode ? "0px 0px 15px #444" : "0px 0px 15px rgba(30, 64, 175, 0.3)" }}
          transition={{ duration: 0.3 }}
          style={{
            background: isDarkMode ? "#333" : "#1e40af",
            color: isDarkMode ? "#ddd" : "white",
            border: isDarkMode ? "1px solid #444" : "1px solid #1e40af",
            padding: "12px 24px",
            fontSize: "14px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
          onClick={() => window.open('https://discord.gg/your-discord-invite', '_blank')}
        >
          <span style={{ fontSize: "20px" }}>💬</span> Join Discord
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CommunitySection;
