import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Homepagefinal from "./pages/homepage/Homepagefinal";
import Login from "./pages/loginpage/Login";
import Browserfinal from "./pages/categories/Browserfinal";
import Signup from "./pages/signuppage/Signup"; // Fixed capitalization

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar always stays at the top */}
      <Routes>
        <Route path="/" element={<Homepagefinal />} /> {/* Index page directs to Homepage */}
        <Route path="/homepage" element={<Homepagefinal />} /> {/* Optional: Keep this for direct access */}
        <Route path="/categories" element={<Browserfinal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer /> {/* Footer always stays at the bottom */}
    </Router>
  );
};

export default App;
