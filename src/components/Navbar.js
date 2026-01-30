import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  // Check if user is logged in
  const token = localStorage.getItem("token");
  
  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          StudySpace
        </NavLink>

        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Home
          </NavLink>

          <NavLink
            to="/spaces"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Browse Spaces
          </NavLink>

          <NavLink
            to="/spaces/new"
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            Add Space
          </NavLink>

          {token ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <NavLink 
              to="/login"
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}