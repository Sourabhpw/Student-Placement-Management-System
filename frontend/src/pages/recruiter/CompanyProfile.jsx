import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    description: '',
    contactEmail: '',
    contactPhone: '',
  });

  const fetchProfile = async () => {
    try {
      const res = await api.get('/companies/my/profile');
      if (res.data.success) {
        const c = res.data.data;
        setCompany(c);
        setFormData({
          name: c.name || '',
          industry: c.industry || '',
          location: c.location || '',
          website: c.website || '',
          description: c.description || '',
          contactEmail: c.contactEmail || '',
          contactPhone: c.contactPhone || '',
        });
      }
    } catch (err) {
      console.error('Failed to load company profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);
    try {
      const res = await api.put(`/companies/${company._id}`, formData);
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Company profile updated successfully!' });
      }
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Error updating profile',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar role="recruiter" />
        <div className="dashboard-content text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar role="recruiter" />

      <div className="dashboard-content">
        <div className="mb-4">
          <h3 className="fw-bold text-dark mb-1">Company Profile</h3>
          <p className="text-muted small">Update your organization overview, industry, and contact coordinates</p>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            {alert.message}
            <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Company Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Industry Sector</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">HQ / Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Official Website</label>
                    <input
                      type="url"
                      className="form-control"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Contact Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Company Description & Mission</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                      disabled={saving}
                    >
                      {saving ? 'Saving...' : 'Save Company Profile'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold text-dark mb-3">Profile Preview</h5>
              <div className="p-3 bg-light rounded-3">
                <h5 className="fw-bold mb-1">{formData.name || 'Your Company'}</h5>
                <p className="small text-muted mb-2">{formData.industry} • {formData.location}</p>
                <p className="small text-secondary mb-3">{formData.description || 'No description provided yet.'}</p>
                {formData.website && (
                  <div className="small">
                    <i className="bi bi-globe text-primary me-1"></i>{' '}
                    <a href={formData.website} target="_blank" rel="noreferrer" className="text-decoration-none">
                      {formData.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
