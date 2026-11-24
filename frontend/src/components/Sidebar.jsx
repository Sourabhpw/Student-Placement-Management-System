import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ role }) => {
  return (
    <div className="dashboard-sidebar d-none d-md-flex flex-column">
      <div className="mb-4">
        <span className="badge bg-primary text-uppercase px-3 py-2 w-100 fw-bold letter-spacing">
          {role} Control Panel
        </span>
      </div>

      <nav className="nav flex-column flex-grow-1">
        {role === 'admin' && (
          <>
            <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-grid-fill"></i> Overview
            </NavLink>
            <NavLink to="/admin/students" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-people-fill"></i> Student Directory
            </NavLink>
            <NavLink to="/admin/companies" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-building"></i> Companies
            </NavLink>
            <NavLink to="/admin/jobs" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-briefcase-fill"></i> Job Openings
            </NavLink>
            <NavLink to="/admin/applications" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-file-earmark-text-fill"></i> Applications
            </NavLink>
            <NavLink to="/admin/drives" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-calendar-event-fill"></i> Placement Drives
            </NavLink>
          </>
        )}

        {role === 'recruiter' && (
          <>
            <NavLink to="/recruiter/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-grid-fill"></i> Dashboard
            </NavLink>
            <NavLink to="/recruiter/company-profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-building-gear"></i> Company Profile
            </NavLink>
            <NavLink to="/recruiter/manage-jobs" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-briefcase-fill"></i> Manage Job Postings
            </NavLink>
            <NavLink to="/recruiter/applicants" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-people-fill"></i> Candidate Applicants
            </NavLink>
          </>
        )}

        {role === 'student' && (
          <>
            <NavLink to="/student/dashboard" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-grid-fill"></i> My Dashboard
            </NavLink>
            <NavLink to="/student/profile" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-person-bounding-box"></i> Profile & Resume
            </NavLink>
            <NavLink to="/student/jobs" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-briefcase-fill"></i> Available Jobs
            </NavLink>
            <NavLink to="/student/my-applications" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-send-check-fill"></i> My Applications
            </NavLink>
            <NavLink to="/drives" className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}>
              <i className="bi bi-calendar3"></i> Drive Schedule
            </NavLink>
          </>
        )}
      </nav>

      <div className="pt-3 border-top mt-auto">
        <div className="small text-muted text-center">
          <i className="bi bi-shield-check text-success me-1"></i> Role: <strong className="text-capitalize">{role}</strong>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
