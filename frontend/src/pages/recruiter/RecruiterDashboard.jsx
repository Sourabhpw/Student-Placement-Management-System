import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          api.get('/analytics/recruiter'),
          api.get('/jobs/recruiter/my'),
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (jobsRes.data.success) setJobs(jobsRes.data.data);
      } catch (err) {
        console.error('Failed to load recruiter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterData();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar role="recruiter" />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Recruiter Command Center</h3>
            <p className="text-muted small mb-0">Managing candidate applications for {stats?.companyName || 'your company'}</p>
          </div>
          <div>
            <Link to="/recruiter/manage-jobs" className="btn btn-primary btn-sm shadow-sm">
              <i className="bi bi-plus-circle me-1"></i> Post New Job
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-4 mb-4">
          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Active Jobs</div>
                  <h3 className="fw-bold mt-2 mb-0 text-dark">{stats?.activeJobs || 0}</h3>
                </div>
                <div className="stat-icon-wrapper bg-primary-subtle text-primary">
                  <i className="bi bi-briefcase"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Total Applicants</div>
                  <h3 className="fw-bold mt-2 mb-0 text-primary">{stats?.totalApplicants || 0}</h3>
                </div>
                <div className="stat-icon-wrapper bg-info-subtle text-info">
                  <i className="bi bi-people"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Shortlisted</div>
                  <h3 className="fw-bold mt-2 mb-0 text-warning">{stats?.shortlisted || 0}</h3>
                </div>
                <div className="stat-icon-wrapper bg-warning-subtle text-warning">
                  <i className="bi bi-star"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Hired / Selected</div>
                  <h3 className="fw-bold mt-2 mb-0 text-success">{stats?.selected || 0}</h3>
                </div>
                <div className="stat-icon-wrapper bg-success-subtle text-success">
                  <i className="bi bi-check2-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posted Jobs Section */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark mb-0">My Posted Job Openings</h5>
            <Link to="/recruiter/manage-jobs" className="small text-primary text-decoration-none">
              Manage All
            </Link>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-file-earmark-plus fs-2"></i>
              <p className="mt-2 small">You haven't posted any jobs yet.</p>
              <Link to="/recruiter/manage-jobs" className="btn btn-outline-primary btn-sm">Create First Job Opening</Link>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Role Type</th>
                    <th>Package</th>
                    <th>Openings</th>
                    <th>Applications</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td className="fw-bold text-dark">{job.title}</td>
                      <td>{job.roleCategory}</td>
                      <td className="fw-bold text-success">₹ {job.packageLPA} LPA</td>
                      <td>{job.openings}</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary fs-6 px-3">
                          {job.applicationCount || 0}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${job.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>
                        <Link to="/recruiter/applicants" className="btn btn-sm btn-outline-primary">
                          Review Applicants
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
