import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) => (isActive ? "active" : undefined);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🎓 AdmissionPredictor</Link>
      <ul className="nav-links">
        <li><NavLink to="/" end className={linkClass}>Home</NavLink></li>
        <li><NavLink to="/predictor" className={linkClass}>Predictor</NavLink></li>
        <li><NavLink to="/colleges" className={linkClass}>Colleges</NavLink></li>
        {user ? (
          <>
            <li><NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink></li>
            <li>
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout ({user.name})
              </button>
            </li>
          </>
        ) : (
          <>
            <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>
            <li><Link to="/register" className="btn">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
