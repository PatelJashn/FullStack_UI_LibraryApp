import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user data on app load
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        
        // Verify token is still valid by calling profile endpoint
        verifyToken(storedToken);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const verifyToken = async (tokenToVerify) => {
    try {
      const response = await fetch("http://localhost:5002/api/auth/profile", {
        headers: {
          "Authorization": `Bearer ${tokenToVerify}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        throw new Error("Token invalid");
      }
      
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    }
  };

  const login = (userData, authToken) => {
    if (authToken) {
      localStorage.setItem("token", authToken);
      setToken(authToken);
    }
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!user && !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 