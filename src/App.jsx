import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Homepagefinal from "./pages/homepage/Homepagefinal";
import Login from "./pages/loginpage/Login";
import Browserfinal from "./pages/categories/Browserfinal";
import Signup from "./pages/signuppage/signup"; // Capitalized 'Signup'

const App = () => {
  return (
    <Router>
      <Navbar /> {/* Navbar always stays at the top */}
      <Routes>
        <Route path="/Homepage" element={<Homepagefinal />} /> {/* Fixed component name */}
        <Route path="/categories" element={<Browserfinal />} /> {/* Fixed component name */}
        <Route path="/login" element={<Login />} /> {/* Login Page */}
        <Route path="/signup" element={<Signup />} /> {/* Added Signup Page */}
      </Routes>
      <Footer /> {/* Added Footer to always stay at the bottom */}
    </Router>
  );
};

export default App;
