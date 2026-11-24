import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    roleCategory: 'Full Time',
    location: '',
    packageLPA: '',
    openings: 1,
    minCgpa: 6.5,
    minTenthPercentage: 60,
    minTwelfthPercentage: 60,
    maxBacklogs: 0,
    allowedBranches: 'MCA, B.Tech CS',
    requiredSkills: '',
    deadline: '',
    description: '',
    status: 'Active',
  });

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs/recruiter/my');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load recruiter jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      roleCategory: 'Full Time',
      location: 'Bangalore, India',
      packageLPA: 8.5,
      openings: 2,
      minCgpa: 6.5,
      minTenthPercentage: 60,
      minTwelfthPercentage: 60,
      maxBacklogs: 0,
      allowedBranches: 'MCA, B.Tech CS',
      requiredSkills: 'Node.js, React.js, Express, MongoDB',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: '',
      status: 'Active',
    });
    setShowModal(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      roleCategory: job.roleCategory,
      location: job.location,
      packageLPA: job.packageLPA,
      openings: job.openings,
      minCgpa: job.eligibility?.minCgpa || 6.0,
      minTenthPercentage: job.eligibility?.minTenthPercentage || 60,
      minTwelfthPercentage: job.eligibility?.minTwelfthPercentage || 60,
      maxBacklogs: job.eligibility?.maxBacklogs || 0,
      allowedBranches: job.eligibility?.allowedBranches?.join(', ') || '',
      requiredSkills: job.requiredSkills?.join(', ') || '',
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
      description: job.description,
      status: job.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: formData.title,
      roleCategory: formData.roleCategory,
      location: formData.location,
      packageLPA: Number(formData.packageLPA),
      openings: Number(formData.openings),
      eligibility: {
        minCgpa: Number(formData.minCgpa),
        minTenthPercentage: Number(formData.minTenthPercentage),
        minTwelfthPercentage: Number(formData.minTwelfthPercentage),
        maxBacklogs: Number(formData.maxBacklogs),
        allowedBranches: formData.allowedBranches.split(',').map((s) => s.trim()).filter(Boolean),
      },
      requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
      deadline: formData.deadline,
      description: formData.description,
      status: formData.status,
    };

    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob._id}`, payload);
      } else {
        await api.post('/jobs', payload);
      }
      setShowModal(false);
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving job posting');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete job');
      }
    }
  };

  return (
    <div className="d-flex">
      <Sidebar role="recruiter" />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Manage Job Openings</h3>
            <p className="text-muted small mb-0">Create, edit, and configure eligibility criteria for campus positions</p>
          </div>
          <button className="btn btn-primary btn-sm shadow-sm" onClick={openCreateModal}>
            <i className="bi bi-plus-circle me-1"></i> Post New Job
          </button>
        </div>

        {/* Jobs Table */}
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
                    <th>Job Title</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Package</th>
                    <th>Min CGPA</th>
                    <th>Applicants</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td className="fw-bold text-dark">{job.title}</td>
                      <td>{job.roleCategory}</td>
                      <td>{job.location}</td>
                      <td className="fw-bold text-success">₹ {job.packageLPA} LPA</td>
                      <td>{job.eligibility?.minCgpa}</td>
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
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openEditModal(job)}
                            title="Edit Job"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(job._id)}
                            title="Delete Job"
                          >
                            <i className="bi bi-trash"></i>
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

        {/* Create / Edit Modal */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content rounded-4 border-0 p-3">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">
                    {editingJob ? 'Edit Job Opening' : 'Post New Job Opening'}
                  </h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-8">
                        <label className="form-label small fw-semibold">Job Title</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Role Type</label>
                        <select
                          className="form-select"
                          value={formData.roleCategory}
                          onChange={(e) => setFormData({ ...formData, roleCategory: e.target.value })}
                        >
                          <option value="Full Time">Full Time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Package (LPA)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={formData.packageLPA}
                          onChange={(e) => setFormData({ ...formData, packageLPA: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Openings</label>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={formData.openings}
                          onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                        />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Min CGPA Required</label>
                        <input
                          type="number"
                          step="0.1"
                          className="form-control"
                          value={formData.minCgpa}
                          onChange={(e) => setFormData({ ...formData, minCgpa: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Max Allowed Backlogs</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.maxBacklogs}
                          onChange={(e) => setFormData({ ...formData, maxBacklogs: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Deadline</label>
                        <input
                          type="date"
                          className="form-control"
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Required Skills (Comma-separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.requiredSkills}
                          onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                          placeholder="Node.js, React.js, Express, MongoDB, Java"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Allowed Degrees/Courses</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.allowedBranches}
                          onChange={(e) => setFormData({ ...formData, allowedBranches: e.target.value })}
                          placeholder="MCA, B.Tech CS, BCA"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label small fw-semibold">Job Description</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required
                        ></textarea>
                      </div>

                      <div className="col-md-4">
                        <label className="form-label small fw-semibold">Status</label>
                        <select
                          className="form-select"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="Active">Active</option>
                          <option value="Closed">Closed</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4">
                      {editingJob ? 'Update Job' : 'Publish Job'}
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

export default ManageJobs;
