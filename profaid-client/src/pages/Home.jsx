import { Link } from "react-router-dom";
import "./Home.css";
export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to ProfAid</h1>
      <p className="home-description">
        A platform where students can raise doubts, professors can reply, and admins can manage the system.
      </p>

      <div className="home-buttons">
        <Link to="/login">
          <button className="home-btn">Get Started → Login</button>
        </Link>
      </div>
    </div>
  );
}
