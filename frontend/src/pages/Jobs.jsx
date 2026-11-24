import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minLpa, setMinLpa] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
      if (category) queryParams.push(`roleCategory=${encodeURIComponent(category)}`);
      if (minLpa) queryParams.push(`minPackage=${minLpa}`);

      const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      const res = await api.get(`/jobs${queryString}`);
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, minLpa]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Campus Job Opportunities</h2>
        <p className="text-muted">Browse full-time openings and internships posted by registered companies.</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="card border-0 shadow-sm p-4 mb-4 rounded-4 bg-white">
        <form onSubmit={handleSearchSubmit} className="row g-3">
          <div className="col-lg-5 col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 bg-light"
                placeholder="Search by job title, company or skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-3">
            <select
              className="form-select bg-light"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Role Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-3">
            <select
              className="form-select bg-light"
              value={minLpa}
              onChange={(e) => setMinLpa(e.target.value)}
            >
              <option value="">Min Package</option>
              <option value="5">5+ LPA</option>
              <option value="8">8+ LPA</option>
              <option value="12">12+ LPA</option>
              <option value="20">20+ LPA</option>
            </select>
          </div>
          <div className="col-lg-2 col-md-12 d-grid">
            <button type="submit" className="btn btn-primary fw-medium">
              Filter Jobs
            </button>
          </div>
        </form>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading active jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-4 border">
          <i className="bi bi-briefcase fs-1 text-muted"></i>
          <h5 className="mt-3 text-secondary">No job postings found</h5>
          <p className="text-muted small">Try adjusting your search criteria or filters.</p>
        </div>
      ) : (
        <div className="row g-4">
          {jobs.map((job) => (
            <div className="col-lg-6" key={job._id}>
              <div className="job-card h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-primary-subtle text-primary mb-2">{job.roleCategory}</span>
                      <h4 className="fw-bold text-dark mb-1">{job.title}</h4>
                      <p className="text-secondary small mb-2">
                        <i className="bi bi-building me-1"></i> {job.company?.name} • <i className="bi bi-geo-alt me-1"></i> {job.location}
                      </p>
                    </div>
                    <span className="badge bg-success-subtle text-success fs-6 fw-bold px-3 py-2">
                      ₹ {job.packageLPA} LPA
                    </span>
                  </div>

                  <p className="text-muted small mb-3">{job.description}</p>

                  <div className="mb-3">
                    <span className="fw-semibold small text-dark me-2">Eligibility:</span>
                    <span className="badge bg-light text-secondary border me-1">Min CGPA: {job.eligibility?.minCgpa}</span>
                    <span className="badge bg-light text-secondary border me-1">Max Backlogs: {job.eligibility?.maxBacklogs}</span>
                  </div>

                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {job.requiredSkills?.map((skill, idx) => (
                      <span key={idx} className="badge bg-light text-dark border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    <i className="bi bi-clock me-1"></i> Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                  <Link to={`/jobs/${job._id}`} className="btn btn-primary btn-sm px-3">
                    View Details & Apply
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
