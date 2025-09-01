import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthContext";
import { useTheme } from "../../components/ThemeContext";
import GoogleSignIn from "../../components/GoogleSignIn";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDarkMode } = useTheme();

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: isDarkMode ? "linear-gradient(135deg, #0f0f0f, #1c1c1c)" : "linear-gradient(135deg, #FAF9F6, #e9ecef)",
      fontFamily: "Arial, sans-serif",
      padding: window.innerWidth <= 768 ? "20px" : "0",
    },
    glassBox: {
      background: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#FAF9F6",
      padding: window.innerWidth <= 768 ? "30px 20px" : "40px",
      borderRadius: "12px",
      backdropFilter: isDarkMode ? "blur(12px)" : "none",
      WebkitBackdropFilter: isDarkMode ? "blur(12px)" : "none",
      boxShadow: isDarkMode ? "0px 0px 15px rgba(255, 255, 255, 0.1)" : "0px 4px 20px rgba(0, 0, 0, 0.08)",
      border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.2)" : "2px solid #000000",
      width: window.innerWidth <= 768 ? "100%" : "400px",
      textAlign: "center",
      color: isDarkMode ? "white" : "#2d3748",
    },
    title: {
      fontSize: window.innerWidth <= 768 ? "22px" : "26px",
      fontWeight: "bold",
      marginBottom: window.innerWidth <= 768 ? "15px" : "20px",
      letterSpacing: "1px",
      textShadow: isDarkMode ? "0px 0px 10px rgba(255, 255, 255, 0.3)" : "none",
      color: isDarkMode ? "white" : "#2d3748",
    },
    inputGroup: {
      textAlign: "left",
      marginBottom: window.innerWidth <= 768 ? "15px" : "20px",
      position: "relative",
    },
    label: {
      display: "block",
      fontSize: window.innerWidth <= 768 ? "13px" : "14px",
      fontWeight: "bold",
      marginBottom: "6px",
      color: isDarkMode ? "#aaa" : "#666666",
    },
    input: {
      width: "100%",
      padding: window.innerWidth <= 768 ? "10px 35px 10px 10px" : "12px 40px 12px 12px",
      border: "none",
      borderRadius: "6px",
      fontSize: window.innerWidth <= 768 ? "14px" : "16px",
      background: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#FAF9F6",
      color: isDarkMode ? "white" : "#2d3748",
      outline: "none",
      transition: "0.3s",
      boxShadow: isDarkMode ? "inset 0px 0px 8px rgba(255, 255, 255, 0.1)" : "inset 0px 0px 8px rgba(0, 0, 0, 0.05)",
      border: isDarkMode ? "none" : "1px solid #d1d5db",
    },
    eyeButton: {
      position: "absolute",
      right: window.innerWidth <= 768 ? "8px" : "10px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: window.innerWidth <= 768 ? "18px" : "20px",
      color: isDarkMode ? "#bbb" : "#666666",
      transition: "0.3s",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: window.innerWidth <= 768 ? "30px" : "35px",
      height: window.innerWidth <= 768 ? "30px" : "35px",
      borderRadius: "50%",
    },
    eyeButtonHover: {
      background: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)",
    },
    button: {
      width: "100%",
      padding: window.innerWidth <= 768 ? "10px" : "12px",
      background: isDarkMode ? "linear-gradient(135deg, #6b47b6, #8a6eff)" : "#1e40af",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: window.innerWidth <= 768 ? "14px" : "16px",
      fontWeight: "bold",
      transition: "0.3s",
      textShadow: isDarkMode ? "0px 0px 5px rgba(255, 255, 255, 0.3)" : "none",
    },
    buttonDisabled: {
      width: "100%",
      padding: window.innerWidth <= 768 ? "10px" : "12px",
      background: isDarkMode ? "rgba(107, 71, 182, 0.5)" : "rgba(30, 64, 175, 0.5)",
      color: "rgba(255, 255, 255, 0.7)",
      border: "none",
      borderRadius: "6px",
      cursor: "not-allowed",
      fontSize: window.innerWidth <= 768 ? "14px" : "16px",
      fontWeight: "bold",
      transition: "0.3s",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      margin: window.innerWidth <= 768 ? "20px 0" : "25px 0",
      color: isDarkMode ? "#aaa" : "#666666",
      fontSize: window.innerWidth <= 768 ? "13px" : "14px",
    },
    dividerLine: {
      flex: 1,
      height: "1px",
      background: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#d1d5db",
    },
    dividerText: {
      padding: "0 15px",
      fontWeight: "500",
    },
    signupText: {
      marginTop: window.innerWidth <= 768 ? "12px" : "15px",
      fontSize: window.innerWidth <= 768 ? "13px" : "14px",
      color: isDarkMode ? "#bbb" : "#666666",
    },
    link: {
      color: isDarkMode ? "#8a6eff" : "#1e40af",
      textDecoration: "none",
      fontWeight: "bold",
    },
    errorMessage: {
      color: "#ff6b6b",
      fontSize: window.innerWidth <= 768 ? "13px" : "14px",
      marginBottom: window.innerWidth <= 768 ? "12px" : "15px",
      padding: window.innerWidth <= 768 ? "8px" : "10px",
      background: isDarkMode ? "rgba(255, 107, 107, 0.1)" : "rgba(255, 107, 107, 0.05)",
      borderRadius: "6px",
      border: "1px solid rgba(255, 107, 107, 0.3)",
    },
    successMessage: {
      color: "#51cf66",
      fontSize: window.innerWidth <= 768 ? "13px" : "14px",
      marginBottom: window.innerWidth <= 768 ? "12px" : "15px",
      padding: window.innerWidth <= 768 ? "8px" : "10px",
      background: isDarkMode ? "rgba(81, 207, 102, 0.1)" : "rgba(81, 207, 102, 0.05)",
      borderRadius: "6px",
      border: "1px solid rgba(81, 207, 102, 0.3)",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Login successful
        login(data.user, data.token);
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassBox}>
        <h2 style={styles.title}>Login</h2>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
              disabled={loading}
            />
            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <button 
            type="submit" 
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine}></div>
        </div>

        {/* Google Sign-In */}
        <GoogleSignIn disabled={loading} />

        <p style={styles.signupText}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
