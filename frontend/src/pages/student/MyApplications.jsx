import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar role="student" />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">My Job Applications</h3>
            <p className="text-muted small mb-0">Track real-time status, recruiter reviews, and interview schedules</p>
          </div>
          <Link to="/student/jobs" className="btn btn-primary btn-sm shadow-sm">
            <i className="bi bi-search me-1"></i> Find More Jobs
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : applications.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
            <i className="bi bi-send-x fs-1 text-muted"></i>
            <h5 className="mt-3 text-secondary">No Applications Submitted</h5>
            <p className="text-muted small">Browse campus vacancies and apply to start receiving recruiter reviews.</p>
            <div className="mt-2">
              <Link to="/student/jobs" className="btn btn-primary px-4">Browse Active Openings</Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {applications.map((app) => (
              <div className="col-12" key={app._id}>
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-primary-subtle text-primary">{app.job?.roleCategory}</span>
                        <span className={`badge px-3 py-1 badge-status-${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </div>
                      <h4 className="fw-bold text-dark mb-1">{app.job?.title}</h4>
                      <p className="text-muted small mb-0">
                        <i className="bi bi-building me-1"></i> {app.job?.company?.name} • <i className="bi bi-geo-alt me-1"></i> {app.job?.location}
                      </p>
                    </div>

                    <div className="text-md-end">
                      <div className="fw-bold text-success fs-5">₹ {app.job?.packageLPA} LPA</div>
                      <div className="small text-muted">Applied on: {new Date(app.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {app.recruiterNotes && (
                    <div className="mt-3 p-3 bg-light rounded-3 small">
                      <strong className="text-dark"><i className="bi bi-chat-left-dots text-primary me-1"></i> Recruiter Feedback:</strong> {app.recruiterNotes}
                    </div>
                  )}

                  {/* Status Timeline History */}
                  <div className="mt-4 pt-3 border-top">
                    <h6 className="fw-bold small text-dark mb-3">Application History & Progression</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {app.statusHistory?.map((step, idx) => (
                        <div key={idx} className="badge bg-light text-dark border p-2 text-start">
                          <div className="fw-bold text-primary">{step.status}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{step.comment}</div>
                          <div className="text-muted opacity-75" style={{ fontSize: '0.7rem' }}>
                            {new Date(step.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
