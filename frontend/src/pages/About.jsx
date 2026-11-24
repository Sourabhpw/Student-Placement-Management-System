import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="text-center mb-5">
            <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
              About PlacementPortal
            </span>
            <h2 className="fw-bold text-dark">Centralized Campus Hiring Platform</h2>
            <p className="lead text-muted">
              Built as an MCA Full-Stack Project to automate and digitize university placement workflows.
            </p>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
            <h4 className="fw-bold text-dark mb-3">Project Mission & Architecture</h4>
            <p className="text-secondary" style={{ lineHeight: '1.8' }}>
              The <strong>Student Placement Management System</strong> resolves key manual pain points in college campus recruitments. It delivers a centralized digital ecosystem for College Administrators, Students, and Company Recruiters to communicate, coordinate placement drives, publish job openings, verify student eligibility criteria automatically, submit applications, upload resumes, and track live offer rollouts.
            </p>

            <div className="row g-4 mt-3">
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h5 className="fw-bold text-primary mb-2">👨‍🎓 Students</h5>
                  <p className="small text-muted mb-0">
                    Maintain verified profiles, upload resumes, check eligibility dynamically, apply to matching companies with a single click, and view status history.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h5 className="fw-bold text-primary mb-2">🏢 Recruiters</h5>
                  <p className="small text-muted mb-0">
                    Post job openings with custom academic cutoffs, screen applicant resumes, shortlist candidates, update hiring stages, and extend job offers.
                  </p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-light rounded-3 h-100 border">
                  <h5 className="fw-bold text-primary mb-2">🏛️ College Admin</h5>
                  <p className="small text-muted mb-0">
                    Full control over student records, partner companies, placement drives, analytics reports (placement percentage, highest & average packages).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <h4 className="fw-bold text-dark mb-3">Technology Stack Highlights</h4>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                  <span className="fs-3">⚛️</span>
                  <div>
                    <h6 className="fw-bold mb-0">Frontend: React.js & Bootstrap 5</h6>
                    <small className="text-muted">Responsive components, modern UI, React Router</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                  <span className="fs-3">🟢</span>
                  <div>
                    <h6 className="fw-bold mb-0">Backend: Node.js & Express.js</h6>
                    <small className="text-muted">RESTful APIs, JWT Auth, Multer for resume upload</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                  <span className="fs-3">🍃</span>
                  <div>
                    <h6 className="fw-bold mb-0">Database: MongoDB & Mongoose</h6>
                    <small className="text-muted">Robust relational models, schema validation, indexes</small>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border rounded-3">
                  <span className="fs-3">🔒</span>
                  <div>
                    <h6 className="fw-bold mb-0">Security: Bcrypt & Role-Based Access</h6>
                    <small className="text-muted">Password hashing, token authentication, error handling</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
