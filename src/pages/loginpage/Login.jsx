import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      width: "400px",
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
      marginBottom: "20px",
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
    eyeButton: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      fontSize: "20px", // Simplistic, balanced size
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassBox}>
        <h2 style={styles.title}>Welcome Back</h2>
        <form>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
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
            />
            
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
        <p style={styles.signupText}>
          Don't have an account? <Link to ="/signup" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
