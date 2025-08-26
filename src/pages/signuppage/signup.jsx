import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../components/ThemeContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: isDarkMode ? "linear-gradient(135deg, #0f0f0f, #1c1c1c)" : "linear-gradient(135deg, #FAF9F6, #e9ecef)",
      fontFamily: "Arial, sans-serif",
    },
    glassBox: {
      background: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#FAF9F6",
      padding: "40px",
      borderRadius: "12px",
      backdropFilter: isDarkMode ? "blur(12px)" : "none",
      WebkitBackdropFilter: isDarkMode ? "blur(12px)" : "none",
      boxShadow: isDarkMode ? "0px 0px 15px rgba(255, 255, 255, 0.1)" : "0px 4px 20px rgba(0, 0, 0, 0.08)",
      border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.2)" : "2px solid #000000",
      width: "420px",
      textAlign: "center",
      color: isDarkMode ? "white" : "#333333",
    },
    title: {
      fontSize: "26px",
      fontWeight: "bold",
      marginBottom: "20px",
      letterSpacing: "1px",
      textShadow: isDarkMode ? "0px 0px 10px rgba(255, 255, 255, 0.3)" : "none",
      color: isDarkMode ? "white" : "#1a1a1a",
    },
    inputGroup: {
      textAlign: "left",
      marginBottom: "18px",
      position: "relative",
    },
    label: {
      display: "block",
      fontSize: "14px",
      fontWeight: "bold",
      marginBottom: "6px",
      color: isDarkMode ? "#aaa" : "#666666",
    },
    input: {
      width: "100%",
      padding: "12px 40px 12px 12px",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      background: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#f8f9fa",
      color: isDarkMode ? "white" : "#333333",
      outline: "none",
      transition: "0.3s",
      boxShadow: isDarkMode ? "inset 0px 0px 8px rgba(255, 255, 255, 0.1)" : "inset 0px 0px 8px rgba(0, 0, 0, 0.05)",
      border: isDarkMode ? "none" : "1px solid #d1d5db",
    },
    inputDisabled: {
      width: "100%",
      padding: "12px 40px 12px 12px",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      background: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(248, 249, 250, 0.5)",
      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(51, 51, 51, 0.7)",
      outline: "none",
      transition: "0.3s",
      boxShadow: isDarkMode ? "inset 0px 0px 8px rgba(255, 255, 255, 0.05)" : "inset 0px 0px 8px rgba(0, 0, 0, 0.03)",
      cursor: "not-allowed",
      border: isDarkMode ? "none" : "1px solid #e5e7eb",
    },
    eyeButton: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "20px",
      color: isDarkMode ? "#bbb" : "#666666",
      transition: "0.3s",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "35px",
      height: "35px",
      borderRadius: "50%",
    },
    eyeButtonHover: {
      background: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: isDarkMode ? "linear-gradient(135deg, #6b47b6, #8a6eff)" : "#1e40af",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "0.3s",
      textShadow: isDarkMode ? "0px 0px 5px rgba(255, 255, 255, 0.3)" : "none",
    },
    buttonDisabled: {
      width: "100%",
      padding: "12px",
      background: isDarkMode ? "rgba(107, 71, 182, 0.5)" : "rgba(30, 64, 175, 0.5)",
      color: "rgba(255, 255, 255, 0.7)",
      border: "none",
      borderRadius: "6px",
      cursor: "not-allowed",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "0.3s",
    },
    signupText: {
      marginTop: "15px",
      fontSize: "14px",
      color: isDarkMode ? "#bbb" : "#666666",
    },
    link: {
      color: isDarkMode ? "#8a6eff" : "#1e40af",
      textDecoration: "none",
      fontWeight: "bold",
    },
    errorMessage: {
      color: "#ff6b6b",
      fontSize: "14px",
      marginBottom: "15px",
      padding: "10px",
      background: isDarkMode ? "rgba(255, 107, 107, 0.1)" : "rgba(255, 107, 107, 0.05)",
      borderRadius: "6px",
      border: "1px solid rgba(255, 107, 107, 0.3)",
    },
    successMessage: {
      color: "#51cf66",
      fontSize: "14px",
      marginBottom: "15px",
      padding: "10px",
      background: isDarkMode ? "rgba(81, 207, 102, 0.1)" : "rgba(81, 207, 102, 0.05)",
      borderRadius: "6px",
      border: "1px solid rgba(81, 207, 102, 0.3)",
    },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5002'}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess("Signup successful! Please login.");
        // Clear form
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassBox}>
        <h2 style={styles.title}>Create an Account</h2>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        {success && <div style={styles.successMessage}>{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={loading ? styles.inputDisabled : styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={loading ? styles.inputDisabled : styles.input}
              disabled={loading}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={loading ? styles.inputDisabled : styles.input}
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
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={loading ? styles.inputDisabled : styles.input}
              disabled={loading}
            />
            <button
              type="button"
              style={styles.eyeButton}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={loading}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <button 
            type="submit" 
            style={loading ? styles.buttonDisabled : styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>
        <p style={styles.signupText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
