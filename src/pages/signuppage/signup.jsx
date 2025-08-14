import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #0f0f0f, #1c1c1c)",
      fontFamily: "Arial, sans-serif",
    },
    glassBox: {
      background: "rgba(255, 255, 255, 0.1)",
      padding: "40px",
      borderRadius: "12px",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: "0px 0px 15px rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      width: "420px",
      textAlign: "center",
      color: "white",
    },
    title: {
      fontSize: "26px",
      fontWeight: "bold",
      marginBottom: "20px",
      letterSpacing: "1px",
      textShadow: "0px 0px 10px rgba(255, 255, 255, 0.3)",
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
      color: "#aaa",
    },
    input: {
      width: "100%",
      padding: "12px 40px 12px 12px",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      background: "rgba(255, 255, 255, 0.2)",
      color: "white",
      outline: "none",
      transition: "0.3s",
      boxShadow: "inset 0px 0px 8px rgba(255, 255, 255, 0.1)",
    },
    inputDisabled: {
      width: "100%",
      padding: "12px 40px 12px 12px",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      background: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.7)",
      outline: "none",
      transition: "0.3s",
      boxShadow: "inset 0px 0px 8px rgba(255, 255, 255, 0.05)",
      cursor: "not-allowed",
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
      color: "#bbb",
      transition: "0.3s",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "35px",
      height: "35px",
      borderRadius: "50%",
    },
    eyeButtonHover: {
      background: "rgba(255, 255, 255, 0.2)",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: "linear-gradient(135deg, #6b47b6, #8a6eff)",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "0.3s",
      textShadow: "0px 0px 5px rgba(255, 255, 255, 0.3)",
    },
    buttonDisabled: {
      width: "100%",
      padding: "12px",
      background: "rgba(107, 71, 182, 0.5)",
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
      color: "#bbb",
    },
    link: {
      color: "#8a6eff",
      textDecoration: "none",
      fontWeight: "bold",
    },
    errorMessage: {
      color: "#ff6b6b",
      fontSize: "14px",
      marginBottom: "15px",
      padding: "10px",
      background: "rgba(255, 107, 107, 0.1)",
      borderRadius: "6px",
      border: "1px solid rgba(255, 107, 107, 0.3)",
    },
    successMessage: {
      color: "#51cf66",
      fontSize: "14px",
      marginBottom: "15px",
      padding: "10px",
      background: "rgba(81, 207, 102, 0.1)",
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
      const response = await fetch("http://localhost:5002/api/auth/signup", {
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
