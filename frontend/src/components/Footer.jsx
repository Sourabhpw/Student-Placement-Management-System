import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-top py-5 mt-auto">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold text-primary mb-3">
              <i className="bi bi-mortarboard-fill me-2"></i>PlacementPortal
            </h5>
            <p className="text-muted small">
              A centralized university campus recruitment management platform connecting students, college administrators, and industry recruiters for seamless placement drives and hiring workflows.
            </p>
            <div className="d-flex gap-3 text-secondary mt-3">
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-secondary fs-5"><i className="bi bi-linkedin"></i></a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-secondary fs-5"><i className="bi bi-github"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-secondary fs-5"><i className="bi bi-twitter-x"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-dark mb-3">Quick Links</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/jobs" className="text-decoration-none text-muted">Browse Jobs</Link></li>
              <li><Link to="/drives" className="text-decoration-none text-muted">Placement Drives</Link></li>
              <li><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted">Contact Support</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold text-dark mb-3">User Portals</h6>
            <ul className="list-unstyled text-muted small d-flex flex-column gap-2">
              <li><Link to="/login" className="text-decoration-none text-muted">Student Login</Link></li>
              <li><Link to="/login" className="text-decoration-none text-muted">Recruiter Portal</Link></li>
              <li><Link to="/login" className="text-decoration-none text-muted">Admin Access</Link></li>
              <li><Link to="/register" className="text-decoration-none text-muted">Register New Student</Link></li>
              <li><Link to="/register" className="text-decoration-none text-muted">Employer Sign Up</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-dark mb-3">Contact Desk</h6>
            <p className="text-muted small mb-2">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i> Training & Placement Cell, Campus Block 4
            </p>
            <p className="text-muted small mb-2">
              <i className="bi bi-envelope-fill text-primary me-2"></i> placements@college.edu
            </p>
            <p className="text-muted small">
              <i className="bi bi-telephone-fill text-primary me-2"></i> +91 (0) 1234-567890
            </p>
          </div>
        </div>

        <hr className="my-4 text-muted opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center text-muted small">
          <div>© {new Date().getFullYear()} Student Placement Management System. Designed for MCA Full-Stack Project.</div>
          <div className="mt-2 mt-md-0">
            <span className="badge bg-success-subtle text-success me-2">● System Active</span>
            <span>All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
