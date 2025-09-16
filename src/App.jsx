import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Homepagefinal from "./pages/homepage/Homepagefinal";
import Login from "./pages/loginpage/Login";
import Browserfinal from "./pages/categories/Browserfinal";
import ComponentDetail from "./pages/component-detail/ComponentDetail";
import Signup from "./pages/signuppage/signup.jsx"; // Fixed capitalization
import UploadPage from "./pages/upload/UploadPage";
import AuthCallback from "./pages/auth/AuthCallback";
import AuthError from "./pages/auth/AuthError";
import { AppwriteAuthProvider } from "./components/AppwriteAuthContext";
import { ThemeProvider } from "./components/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
// import Showcase from "./pages/showcase/Showcasefinal"

const App = () => {
  // TEMP: Verify Vite env variables in browser console
  console.log("VITE vars:", {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_APPWRITE_ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
    VITE_APPWRITE_PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID
  });
  return (
    <ThemeProvider>
      <AppwriteAuthProvider>
        <Router>
          <Navbar /> {/* Navbar always stays at the top */}
          <Routes>
            <Route path="/" element={<Homepagefinal />} /> {/* Index page directs to Homepage */}
            <Route path="/homepage" element={<Homepagefinal />} /> {/* Optional: Keep this for direct access */}
            <Route path="/categories" element={
              <Browserfinal />
            } />
            <Route path="/component/:id" element={<ComponentDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/upload" element={<UploadPage />} />
            {/* Auth callback routes for Google OAuth */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/error" element={<AuthError />} />
          </Routes>
          <Footer /> {/* Footer always stays at the bottom */}
        </Router>
      </AppwriteAuthProvider>
    </ThemeProvider>
  );
};

export default App;
