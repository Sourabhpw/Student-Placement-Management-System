import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PlacementDrives = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Create drive modal for admin/recruiter
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    driveDate: '',
    venue: 'Campus Main Auditorium',
    driveType: 'On-Campus',
    description: '',
    eligibleCourses: 'MCA, B.Tech CS, BCA',
  });

  const fetchDrives = async () => {
    setLoading(true);
    try {
      const [drivesRes, compRes] = await Promise.all([
        api.get('/drives'),
        api.get('/companies'),
      ]);
      if (drivesRes.data.success) setDrives(drivesRes.data.data);
      if (compRes.data.success) {
        setCompanies(compRes.data.data);
        if (compRes.data.data.length > 0) {
          setFormData((prev) => ({ ...prev, company: compRes.data.data[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load drives:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        eligibleCourses: formData.eligibleCourses.split(',').map((c) => c.trim()).filter(Boolean),
      };
      await api.post('/drives', payload);
      setShowModal(false);
      fetchDrives();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating placement drive');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Campus Placement Drives</h2>
          <p className="text-muted">Stay informed regarding campus recruitment drives, dates, and venues</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'recruiter') && (
          <button className="btn btn-primary btn-sm shadow-sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-calendar-plus me-1"></i> Schedule New Drive
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : drives.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
          <i className="bi bi-calendar-x fs-1 text-muted"></i>
          <h5 className="mt-3 text-secondary">No Placement Drives Scheduled</h5>
          <p className="text-muted small">New drive schedules will be posted here as recruiters announce them.</p>
        </div>
      ) : (
        <div className="row g-4">
          {drives.map((drive) => (
            <div className="col-lg-6" key={drive._id}>
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary-subtle text-primary px-3 py-1">
                      {drive.driveType}
                    </span>
                    <span className={`badge ${drive.status === 'Upcoming' ? 'bg-success' : 'bg-secondary'}`}>
                      {drive.status}
                    </span>
                  </div>

                  <h4 className="fw-bold text-dark mb-1">{drive.title}</h4>
                  <p className="text-primary fw-medium small mb-3">
                    <i className="bi bi-building me-1"></i> {drive.company?.name} ({drive.company?.industry})
                  </p>

                  <p className="text-muted small mb-3">{drive.description}</p>

                  <div className="bg-light p-3 rounded-3 small mb-3">
                    <div className="mb-1">
                      <i className="bi bi-calendar3 text-primary me-2"></i>
                      <strong>Date:</strong> {new Date(drive.driveDate).toLocaleDateString()}
                    </div>
                    <div>
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      <strong>Venue:</strong> {drive.venue}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <div className="small text-muted">
                    Eligible: <strong>{drive.eligibleCourses?.join(', ')}</strong>
                  </div>
                  {drive.company?.website && (
                    <a
                      href={drive.company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      Company Site <i className="bi bi-box-arrow-up-right small"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Drive Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content rounded-4 border-0 p-3">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">Schedule Placement Drive</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Drive Title</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Annual Campus Recruitment 2026"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Company</label>
                      <select
                        className="form-select"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      >
                        {companies.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Drive Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.driveDate}
                        onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Drive Type</label>
                      <select
                        className="form-select"
                        value={formData.driveType}
                        onChange={(e) => setFormData({ ...formData, driveType: e.target.value })}
                      >
                        <option value="On-Campus">On-Campus</option>
                        <option value="Pool-Campus">Pool-Campus</option>
                        <option value="Virtual">Virtual</option>
                        <option value="Off-Campus">Off-Campus</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Venue / Online Link</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Campus Lab 3, Auditorium or Google Meet link"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Eligible Degrees (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.eligibleCourses}
                        onChange={(e) => setFormData({ ...formData, eligibleCourses: e.target.value })}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Drive Description & Instructions</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Instructions for students regarding dress code, resume copies, etc."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0">
                  <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary px-4">
                    Schedule Drive
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacementDrives;
