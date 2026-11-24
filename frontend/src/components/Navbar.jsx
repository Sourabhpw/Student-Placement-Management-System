import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'recruiter':
        return '/recruiter/dashboard';
      case 'student':
        return '/student/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-primary" to="/">
          <span className="brand-badge fs-6">
            <i className="bi bi-mortarboard-fill"></i> PlacementPortal
          </span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium text-secondary" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium text-secondary" to="/jobs">
                Browse Jobs
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium text-secondary" to="/drives">
                Placement Drives
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium text-secondary" to="/about">
                About Us
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link px-3 fw-medium text-secondary" to="/contact">
                Contact
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <Link to={getDashboardPath()} className="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold">
                  <i className="bi bi-grid-fill me-1"></i> Dashboard
                </Link>
                <div className="dropdown">
                  <button
                    className="btn btn-light btn-sm dropdown-toggle d-flex align-items-center gap-2 px-3 py-2 border"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle text-primary"></i>
                    <span className="fw-medium text-dark">{user?.name}</span>
                    <span className="badge bg-primary-subtle text-primary text-uppercase" style={{ fontSize: '0.7rem' }}>
                      {user?.role}
                    </span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                    <li>
                      <Link className="dropdown-item py-2" to={getDashboardPath()}>
                        <i className="bi bi-speedometer2 me-2 text-muted"></i> Dashboard
                      </Link>
                    </li>
                    {user?.role === 'student' && (
                      <li>
                        <Link className="dropdown-item py-2" to="/student/profile">
                          <i className="bi bi-person-lines-fill me-2 text-muted"></i> My Profile
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item py-2 text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-primary btn-sm px-3 py-2 fw-medium">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm px-3 py-2 fw-medium shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
