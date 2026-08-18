import { Link, useNavigate } from "react-router-dom";
import {
  FaBook,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    toast.success("Logout successful");

    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link
          to="/dashboard"
          className="navbar-brand fw-bold"
        >
          <FaBook className="me-2" />
          LMS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >
          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <Link
                to="/courses"
                className="nav-link"
              >
                Courses
              </Link>
            </li>

            {user?.role === "admin" && (
              <li className="nav-item">
                <Link
                  to="/categories"
                  className="nav-link"
                >
                  Categories
                </Link>
              </li>
            )}

          </ul>

          {user && (
            <div className="d-flex align-items-center text-white">

              <span className="me-3">
                <FaUser className="me-1" />
                {user.name}
                <small className="ms-2 text-light">
                  ({user.role})
                </small>
              </span>

              <button
                className="btn btn-outline-light btn-sm"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-1" />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;