import { useNavigate } from "react-router-dom";
import Homepage from "./homepagecomponent/Homepage"
import Box1 from "./homepagecomponent/Box1";
import Box2 from "./homepagecomponent/Box2";
import Box3 from "./homepagecomponent/Box3";
import Rest from "./homepagecomponent/Rest";
import Leaderboard from "./homepagecomponent/Leaderboard";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Homepage/>
      <Box1 />
      <Box2 />
      <Box3 />
      <Rest />
      <Leaderboard />
    </div>
  );
};

export default Home;
