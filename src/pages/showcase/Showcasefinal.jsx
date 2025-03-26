import { useNavigate } from "react-router-dom";
import Showcase from "./showcasecomponents/Showcase"

const Show = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Showcase /> {/* This will render the Browser component */}
    </div>
  );
};

export default Show;
