import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, appsRes, drivesRes] = await Promise.all([
          api.get('/analytics/student'),
          api.get('/applications/my'),
          api.get('/drives?status=Upcoming'),
        ]);

        if (statsRes.data.success) setStats(statsRes.data.data);
        if (appsRes.data.success) setRecentApplications(appsRes.data.data.slice(0, 5));
        if (drivesRes.data.success) setUpcomingDrives(drivesRes.data.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar role="student" />

      <div className="dashboard-content">
        {/* Welcome Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Welcome back, {user?.name}! 👋</h3>
            <p className="text-muted small mb-0">Here is an overview of your campus placement journey</p>
          </div>
          <div>
            <Link to="/student/profile" className="btn btn-outline-primary btn-sm me-2">
              <i className="bi bi-person me-1"></i> Update Profile
            </Link>
            <Link to="/student/jobs" className="btn btn-primary btn-sm shadow-sm">
              <i className="bi bi-briefcase me-1"></i> Find Opportunities
            </Link>
          </div>
        </div>

        {/* Status Callout */}
        <div className="card border-0 shadow-sm p-4 rounded-4 mb-4 bg-white">
          <div className="row align-items-center g-3">
            <div className="col-md-8">
              <div className="d-flex align-items-center gap-3">
                <div className={`p-3 rounded-circle ${stats?.placementStatus === 'Placed' ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'} fs-3`}>
                  {stats?.placementStatus === 'Placed' ? '🎉' : '🎯'}
                </div>
                <div>
                  <h5 className="fw-bold mb-1">
                    Placement Status: <span className={stats?.placementStatus === 'Placed' ? 'text-success' : 'text-primary'}>{stats?.placementStatus || 'In Progress'}</span>
                  </h5>
                  <p className="text-muted small mb-0">
                    {stats?.placementStatus === 'Placed'
                      ? `Congratulations! Placed with offer of ₹ ${stats?.placedPackageLPA} LPA.`
                      : 'Keep your resume updated and apply to active positions matching your skills.'}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <Link to="/student/profile" className="btn btn-sm btn-light border">
                View Resume & Academic Info
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Active Jobs</div>
                  <h3 className="fw-bold mt-2 mb-0 text-dark">{stats?.totalAvailableJobs || 0}</h3>
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
                  <div className="text-muted small fw-medium">Applied Jobs</div>
                  <h3 className="fw-bold mt-2 mb-0 text-primary">{stats?.totalApplications || 0}</h3>
                </div>
                <div className="stat-icon-wrapper bg-info-subtle text-info">
                  <i className="bi bi-send-check"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Shortlisted</div>
                  <h3 className="fw-bold mt-2 mb-0 text-warning">{stats?.shortlistedCount || 0}</h3>
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
                  <div className="text-muted small fw-medium">Offers / Selected</div>
                  <h3 className="fw-bold mt-2 mb-0 text-success">{stats?.selectedCount || 0}</h3>
                </div>
                <div className="stat-icon-wrapper bg-success-subtle text-success">
                  <i className="bi bi-check-circle"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tables & Drives Layout */}
        <div className="row g-4">
          {/* Recent Applications */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">My Recent Applications</h5>
                <Link to="/student/my-applications" className="small text-primary text-decoration-none">
                  View All ({recentApplications.length})
                </Link>
              </div>

              {recentApplications.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <i className="bi bi-inbox fs-2"></i>
                  <p className="mt-2 small">You haven't submitted any applications yet.</p>
                  <Link to="/student/jobs" className="btn btn-outline-primary btn-sm">Explore Openings</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-custom">
                    <thead>
                      <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Package</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((app) => (
                        <tr key={app._id}>
                          <td className="fw-semibold text-dark">{app.job?.title}</td>
                          <td className="text-secondary">{app.job?.company?.name}</td>
                          <td className="fw-bold text-success">₹ {app.job?.packageLPA} LPA</td>
                          <td>
                            <span className={`badge px-2 py-1 badge-status-${app.status.toLowerCase()}`}>
                              {app.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Drives Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3">Campus Drives</h5>
              {upcomingDrives.length === 0 ? (
                <p className="text-muted small">No upcoming drives announced right now.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {upcomingDrives.map((d) => (
                    <div key={d._id} className="p-3 bg-light rounded-3 border">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="fw-bold text-dark mb-0">{d.company?.name}</h6>
                        <span className="badge bg-primary-subtle text-primary small">{d.driveType}</span>
                      </div>
                      <p className="small text-muted mb-2">{d.title}</p>
                      <div className="small text-secondary">
                        <div><i className="bi bi-calendar3 me-1 text-primary"></i> {new Date(d.driveDate).toLocaleDateString()}</div>
                        <div><i className="bi bi-geo-alt me-1 text-primary"></i> {d.venue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
