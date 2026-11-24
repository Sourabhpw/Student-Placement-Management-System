import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/admin');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="d-flex">
      <Sidebar role="admin" />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">College Placement Administration</h3>
            <p className="text-muted small mb-0">Central placement monitoring & statistics dashboard</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/students" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-people me-1"></i> Students Directory
            </Link>
            <Link to="/admin/jobs" className="btn btn-primary btn-sm shadow-sm">
              <i className="bi bi-briefcase me-1"></i> Manage Jobs
            </Link>
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="row g-4 mb-4">
          <div className="col-lg-3 col-md-6 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Total Students</div>
                  <h3 className="fw-bold mt-2 mb-0 text-dark">{stats?.totalStudents || 0}</h3>
                  <div className="small text-muted mt-1">{stats?.placedStudents || 0} Placed</div>
                </div>
                <div className="stat-icon-wrapper bg-primary-subtle text-primary">
                  <i className="bi bi-mortarboard"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Placement Rate</div>
                  <h3 className="fw-bold mt-2 mb-0 text-success">{stats?.placementRate || 0}%</h3>
                  <div className="small text-muted mt-1">{stats?.unplacedStudents || 0} Unplaced</div>
                </div>
                <div className="stat-icon-wrapper bg-success-subtle text-success">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Partner Companies</div>
                  <h3 className="fw-bold mt-2 mb-0 text-dark">{stats?.totalCompanies || 0}</h3>
                  <div className="small text-muted mt-1">{stats?.activeJobs || 0} Active Openings</div>
                </div>
                <div className="stat-icon-wrapper bg-info-subtle text-info">
                  <i className="bi bi-building"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <div className="stat-card">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-medium">Highest Package</div>
                  <h3 className="fw-bold mt-2 mb-0 text-warning">₹ {stats?.highestPackage || 0} LPA</h3>
                  <div className="small text-muted mt-1">Avg: ₹ {stats?.averagePackage || 0} LPA</div>
                </div>
                <div className="stat-icon-wrapper bg-warning-subtle text-warning">
                  <i className="bi bi-trophy"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Application Statuses Breakdown & Recent Applications */}
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <h5 className="fw-bold text-dark mb-3">Application Pipeline</h5>
              <div className="d-flex flex-column gap-3">
                {stats?.applicationStatusCounts?.map((item) => (
                  <div key={item._id} className="d-flex justify-content-between align-items-center p-2 rounded-3 bg-light">
                    <span className="fw-semibold text-secondary">{item._id}</span>
                    <span className="badge bg-primary rounded-pill px-3 py-2">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold text-dark mb-0">Recent Applications Across Campus</h5>
                <Link to="/admin/applications" className="small text-primary text-decoration-none">
                  View All
                </Link>
              </div>

              <div className="table-responsive">
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Target Role</th>
                      <th>Company</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentApplications?.map((app) => (
                      <tr key={app._id}>
                        <td className="fw-bold text-dark">{app.student?.user?.name || 'Student'}</td>
                        <td className="text-secondary">{app.job?.title}</td>
                        <td className="text-muted">{app.company?.name}</td>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
