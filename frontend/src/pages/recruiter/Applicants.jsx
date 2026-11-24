import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [notesModal, setNotesModal] = useState({ open: false, app: null, status: '', notes: '' });

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const res = await api.get(`/applications/recruiter${query}`);
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter]);

  const handleUpdateStatus = async () => {
    if (!notesModal.app) return;
    try {
      await api.put(`/applications/${notesModal.app._id}/status`, {
        status: notesModal.status,
        notes: notesModal.notes,
      });
      setNotesModal({ open: false, app: null, status: '', notes: '' });
      fetchApplicants();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const openStatusModal = (app, newStatus) => {
    setNotesModal({
      open: true,
      app,
      status: newStatus,
      notes: app.recruiterNotes || '',
    });
  };

  return (
    <div className="d-flex">
      <Sidebar role="recruiter" />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Candidate Applicants</h3>
            <p className="text-muted small mb-0">Screen candidate resumes, academic profiles, and update hiring stage</p>
          </div>
          <div>
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-person-x fs-1"></i>
              <p className="mt-2">No candidate applications found for the selected filter.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Applied Job</th>
                    <th>CGPA</th>
                    <th>Skills</th>
                    <th>Resume</th>
                    <th>Current Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <div className="fw-bold text-dark">{app.student?.user?.name}</div>
                        <div className="small text-muted">{app.student?.user?.email}</div>
                        <div className="small text-muted">{app.student?.rollNumber} • {app.student?.course}</div>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{app.job?.title}</div>
                        <div className="small text-success fw-bold">₹ {app.job?.packageLPA} LPA</div>
                      </td>
                      <td className="fw-bold text-primary">
                        {app.student?.academicDetails?.graduationCgpa || 'N/A'}
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '180px' }}>
                          {app.student?.skills?.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="badge bg-light text-secondary border small">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        {app.resumeUrl || app.student?.resumeUrl ? (
                          <a
                            href={`http://localhost:5000${app.resumeUrl || app.student?.resumeUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-danger"
                          >
                            <i className="bi bi-file-earmark-pdf"></i> Resume
                          </a>
                        ) : (
                          <span className="text-muted small">No file</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge px-2 py-1 badge-status-${app.status.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => openStatusModal(app, 'Shortlisted')}
                            title="Shortlist"
                          >
                            Shortlist
                          </button>
                          <button
                            className="btn btn-outline-success"
                            onClick={() => openStatusModal(app, 'Selected')}
                            title="Select"
                          >
                            Hire
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => openStatusModal(app, 'Rejected')}
                            title="Reject"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for Recruiter Note & Status Confirmation */}
        {notesModal.open && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content rounded-4 border-0 p-3">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">
                    Update Status to <span className="text-primary">{notesModal.status}</span>
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setNotesModal({ open: false, app: null, status: '', notes: '' })}
                  ></button>
                </div>
                <div className="modal-body">
                  <p className="small text-muted">
                    Candidate: <strong>{notesModal.app?.student?.user?.name}</strong> for role{' '}
                    <strong>{notesModal.app?.job?.title}</strong>
                  </p>
                  <label className="form-label small fw-semibold">Feedback / Recruiter Notes</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter interview feedback, reason or comments..."
                    value={notesModal.notes}
                    onChange={(e) => setNotesModal({ ...notesModal, notes: e.target.value })}
                  ></textarea>
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setNotesModal({ open: false, app: null, status: '', notes: '' })}
                  >
                    Cancel
                  </button>
                  <button type="button" className="btn btn-primary px-4" onClick={handleUpdateStatus}>
                    Confirm Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applicants;
