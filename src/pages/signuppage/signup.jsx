import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppwriteAuth } from "../../components/AppwriteAuthContext";
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
  const { signup, loginWithGoogle, error: authError, clearError } = useAppwriteAuth();
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
      width: window.innerWidth <= 768 ? "100%" : "420px",
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
      marginBottom: window.innerWidth <= 768 ? "15px" : "18px",
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
    inputDisabled: {
      width: "100%",
      padding: window.innerWidth <= 768 ? "10px 35px 10px 10px" : "12px 40px 12px 12px",
      border: "none",
      borderRadius: "6px",
      fontSize: window.innerWidth <= 768 ? "14px" : "16px",
      background: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(248, 249, 250, 0.5)",
      color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(45, 55, 72, 0.7)",
      outline: "none",
      transition: "0.3s",
      boxShadow: isDarkMode ? "inset 0px 0px 8px rgba(255, 255, 255, 0.05)" : "inset 0px 0px 8px rgba(0, 0, 0, 0.03)",
      cursor: "not-allowed",
      border: isDarkMode ? "none" : "1px solid #e5e7eb",
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
    clearError();
    setLoading(true);

    try {
      const result = await signup(
        formData.email.trim(),
        formData.password,
        formData.username.trim()
      );
      
      if (result.success) {
        setSuccess("Signup successful! You are now logged in.");
        // Clear form
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        // Redirect to home after 2 seconds
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError(result.error || "Signup failed");
      }
    } catch (error) {
      setError("Network error. Please check your connection.");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    clearError();
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setError(result.error || "Google signup failed");
        setLoading(false);
      }
      // If successful, user will be redirected to callback page
    } catch (error) {
      setError("Google signup error. Please try again.");
      setLoading(false);
      console.error("Google signup error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassBox}>
        <h2 style={styles.title}>Create an Account</h2>
        
        {(error || authError) && <div style={styles.errorMessage}>{error || authError}</div>}
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
        
        <div style={{
          margin: "20px 0",
          textAlign: "center",
          position: "relative"
        }}>
          <div style={{
            height: "1px",
            background: isDarkMode ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb",
            margin: "20px 0"
          }}></div>
          <span style={{
            position: "absolute",
            top: "-10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#FAF9F6",
            padding: "0 15px",
            color: isDarkMode ? "#aaa" : "#666666",
            fontSize: "14px"
          }}>
            OR
          </span>
        </div>

        <button 
          type="button"
          onClick={handleGoogleSignup}
          style={{
            width: "100%",
            padding: window.innerWidth <= 768 ? "10px" : "12px",
            background: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "white",
            color: isDarkMode ? "white" : "#2d3748",
            border: isDarkMode ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: window.innerWidth <= 768 ? "14px" : "16px",
            fontWeight: "bold",
            transition: "0.3s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: loading ? 0.7 : 1
          }}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Connecting..." : "Sign up with Google"}
        </button>
        
        <p style={styles.signupText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
