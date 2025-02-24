import { useNavigate } from "react-router-dom";
import Browser from "./browsercomponent/Browser"; // Ensure the file path is correct

const Browserfinal = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Browser /> {/* This will render the Browser component */}
    </div>
  );
};

export default Browserfinal;
