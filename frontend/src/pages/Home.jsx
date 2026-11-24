import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [jobsRes, drivesRes] = await Promise.all([
          api.get('/jobs?limit=4'),
          api.get('/drives?status=Upcoming'),
        ]);
        if (jobsRes.data.success) setFeaturedJobs(jobsRes.data.data.slice(0, 4));
        if (drivesRes.data.success) setUpcomingDrives(drivesRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 bg-white border-bottom position-relative overflow-hidden">
        <div className="container py-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill fw-semibold">
                🚀 Campus Placement Management System 2026
              </span>
              <h1 className="display-4 fw-extrabold text-dark tracking-tight mb-3">
                Empowering Students. <br />
                Connecting <span className="text-primary">Top Recruiters.</span>
              </h1>
              <p className="lead text-secondary mb-4">
                A modern, automated full-stack platform designed to streamline campus recruitment, manage student profiles, schedule placement drives, and track job applications in real time.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-primary btn-lg px-4 shadow-sm">
                  Get Started as Student <i className="bi bi-arrow-right ms-2"></i>
                </Link>
                <Link to="/jobs" className="btn btn-outline-secondary btn-lg px-4">
                  Browse Active Jobs
                </Link>
              </div>

              {/* Quick Stats Highlights */}
              <div className="row mt-5 pt-3 border-top g-4">
                <div className="col-4">
                  <h3 className="fw-bold text-primary mb-0">95%+</h3>
                  <p className="text-muted small mb-0">Placement Assistance</p>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold text-primary mb-0">120+</h3>
                  <p className="text-muted small mb-0">Partner Companies</p>
                </div>
                <div className="col-4">
                  <h3 className="fw-bold text-primary mb-0">₹22 LPA</h3>
                  <p className="text-muted small mb-0">Highest Package</p>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 p-md-5 bg-light rounded-4 border shadow-sm text-center">
                <div className="mb-4">
                  <div className="d-inline-flex p-3 rounded-circle bg-primary text-white fs-1 shadow-sm">
                    🎓
                  </div>
                </div>
                <h4 className="fw-bold mb-2">Campus Recruitment Portal</h4>
                <p className="text-muted small mb-4">
                  Access role-based portals for students, corporate recruiters, and college placement officers.
                </p>
                <div className="d-grid gap-2">
                  <Link to="/login" className="btn btn-outline-primary py-2 text-start px-3 d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-mortarboard me-2"></i> Student Login</span>
                    <i className="bi bi-chevron-right"></i>
                  </Link>
                  <Link to="/login" className="btn btn-outline-primary py-2 text-start px-3 d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-building me-2"></i> Recruiter Login</span>
                    <i className="bi bi-chevron-right"></i>
                  </Link>
                  <Link to="/login" className="btn btn-outline-primary py-2 text-start px-3 d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-shield-lock me-2"></i> Admin Portal</span>
                    <i className="bi bi-chevron-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-primary fw-bold text-uppercase small">Recent Opportunities</span>
              <h2 className="fw-bold text-dark mb-0">Featured Job Openings</h2>
            </div>
            <Link to="/jobs" className="btn btn-outline-primary btn-sm">
              View All Jobs <i className="bi bi-arrow-right"></i>
            </Link>
          </div>

          <div className="row g-4">
            {featuredJobs.map((job) => (
              <div className="col-lg-6" key={job._id}>
                <div className="job-card h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="badge bg-primary-subtle text-primary mb-2">{job.roleCategory}</span>
                        <h5 className="fw-bold text-dark mb-1">{job.title}</h5>
                        <p className="text-secondary small mb-2">
                          <i className="bi bi-building me-1"></i> {job.company?.name || 'Top Tech Firm'} • <i className="bi bi-geo-alt me-1"></i> {job.location}
                        </p>
                      </div>
                      <span className="badge bg-success-subtle text-success fs-6 fw-bold px-3 py-2">
                        ₹ {job.packageLPA} LPA
                      </span>
                    </div>
                    <p className="text-muted small mb-3 text-truncate-2">
                      {job.description}
                    </p>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {job.requiredSkills?.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="badge bg-light text-dark border">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                    <span className="text-muted small">
                      <i className="bi bi-calendar2 me-1"></i> Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </span>
                    <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm px-3">
                      View Details & Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Drives Section */}
      <section className="py-5 bg-white border-top">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="text-primary fw-bold text-uppercase small">On & Off Campus</span>
            <h2 className="fw-bold text-dark">Upcoming Placement Drives</h2>
            <p className="text-muted">Prepare ahead of time for campus recruitment tests and interview sessions.</p>
          </div>

          <div className="row g-4 justify-content-center">
            {upcomingDrives.map((drive) => (
              <div className="col-md-4" key={drive._id}>
                <div className="card h-100 border rounded-4 shadow-sm p-3">
                  <div className="card-body">
                    <span className="badge bg-info-subtle text-info-emphasis mb-2">{drive.driveType}</span>
                    <h5 className="card-title fw-bold text-dark mb-2">{drive.title}</h5>
                    <p className="text-muted small mb-3">
                      <i className="bi bi-building me-1 text-primary"></i> {drive.company?.name}
                    </p>
                    <p className="small text-secondary mb-3">{drive.description}</p>
                    <div className="bg-light p-2 rounded-3 small mb-3">
                      <div><i className="bi bi-calendar-event me-2 text-primary"></i> <strong>Date:</strong> {new Date(drive.driveDate).toLocaleDateString()}</div>
                      <div><i className="bi bi-geo-alt me-2 text-primary"></i> <strong>Venue:</strong> {drive.venue}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
