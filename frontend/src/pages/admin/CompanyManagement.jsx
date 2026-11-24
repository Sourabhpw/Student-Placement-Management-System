import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Information Technology',
    location: 'Bangalore, India',
    website: 'https://example.com',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/companies');
      if (res.data.success) {
        setCompanies(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company and all its associated jobs?')) {
      try {
        await api.delete(`/companies/${id}`);
        fetchCompanies();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting company');
      }
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/companies', formData);
      setShowModal(false);
      fetchCompanies();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create company');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar role="admin" />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Company Directory</h3>
            <p className="text-muted small mb-0">Manage authorized campus hiring companies and partner recruiters</p>
          </div>
          <button className="btn btn-primary btn-sm shadow-sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-building-add me-1"></i> Add Partner Company
          </button>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Industry</th>
                    <th>HQ Location</th>
                    <th>Contact Email</th>
                    <th>Website</th>
                    <th>Recruiter Account</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((c) => (
                    <tr key={c._id}>
                      <td className="fw-bold text-dark">{c.name}</td>
                      <td>{c.industry}</td>
                      <td>{c.location}</td>
                      <td>{c.contactEmail || 'N/A'}</td>
                      <td>
                        {c.website ? (
                          <a href={c.website} target="_blank" rel="noreferrer" className="text-decoration-none">
                            Visit Site <i className="bi bi-box-arrow-up-right small"></i>
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
                          {c.recruiter?.name || 'Recruiter'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(c._id)}
                          title="Delete Company"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content rounded-4 border-0 p-3">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Register Company</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleCreateSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Company Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Industry</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.industry}
                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Website</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Contact Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4">
                      Add Company
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManagement;
