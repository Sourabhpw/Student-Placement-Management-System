import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [eligibilityCheck, setEligibilityCheck] = useState({ isEligible: true, reasons: [] });
  const [userApplication, setUserApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
          if (res.data.eligibilityCheck) {
            setEligibilityCheck(res.data.eligibilityCheck);
          }
          if (res.data.userApplication) {
            setUserApplication(res.data.userApplication);
          }
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'student') {
      setAlert({ type: 'danger', message: 'Only registered students can apply for campus jobs' });
      return;
    }

    setApplying(true);
    setAlert(null);
    try {
      const res = await api.post(`/applications/apply/${id}`, { coverLetter });
      if (res.data.success) {
        setUserApplication(res.data.data);
        setAlert({ type: 'success', message: 'Your application has been successfully submitted!' });
      }
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to submit application',
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container py-5 text-center">
        <h4>Job not found or has expired.</h4>
        <Link to="/jobs" className="btn btn-primary mt-3">Back to Jobs</Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link to="/jobs" className="text-decoration-none text-muted small">
          <i className="bi bi-arrow-left me-1"></i> Back to all listings
        </Link>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
          {alert.message}
          <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Job Info */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div>
                <span className="badge bg-primary-subtle text-primary mb-2 px-3 py-1">{job.roleCategory}</span>
                <h2 className="fw-bold text-dark mb-1">{job.title}</h2>
                <h5 className="text-muted fw-normal">
                  <i className="bi bi-building me-1"></i> {job.company?.name} • <i className="bi bi-geo-alt me-1"></i> {job.location}
                </h5>
              </div>
              <div className="text-end">
                <span className="badge bg-success-subtle text-success fs-5 fw-bold px-3 py-2">
                  ₹ {job.packageLPA} LPA
                </span>
                <div className="text-muted small mt-1">{job.openings} Openings</div>
              </div>
            </div>

            <hr className="my-4 text-muted opacity-25" />

            <h5 className="fw-bold mb-3">Job Description</h5>
            <p className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.7' }}>
              {job.description}
            </p>

            <h5 className="fw-bold mt-4 mb-3">Required Technical Skills</h5>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {job.requiredSkills?.map((skill, idx) => (
                <span key={idx} className="badge bg-light text-dark border px-3 py-2 fs-6">
                  {skill}
                </span>
              ))}
            </div>

            <h5 className="fw-bold mt-4 mb-3">Eligibility Criteria</h5>
            <ul className="list-group list-group-flush border rounded-3 mb-4">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>Minimum Graduation CGPA</span>
                <span className="fw-bold text-primary">{job.eligibility?.minCgpa} CGPA</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>Minimum 10th / 12th Percentage</span>
                <span className="fw-bold">{job.eligibility?.minTenthPercentage}% / {job.eligibility?.minTwelfthPercentage}%</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>Maximum Allowed Backlogs</span>
                <span className="fw-bold">{job.eligibility?.maxBacklogs}</span>
              </li>
              <li className="list-group-item d-flex justify-content-between align-items-center">
                <span>Eligible Branches / Courses</span>
                <span className="fw-bold">{job.eligibility?.allowedBranches?.join(', ') || 'All Courses'}</span>
              </li>
            </ul>

            <h5 className="fw-bold mt-4 mb-3">About the Hiring Company</h5>
            <div className="p-3 bg-light rounded-3">
              <h6 className="fw-bold">{job.company?.name}</h6>
              <p className="text-muted small mb-2">{job.company?.description || 'Leading enterprise in software engineering and technology consulting.'}</p>
              <div className="small text-secondary">
                <i className="bi bi-globe me-1"></i> <a href={job.company?.website} target="_blank" rel="noreferrer" className="text-decoration-none">{job.company?.website}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Application Card */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 bg-white sticky-top" style={{ top: '90px' }}>
            <h5 className="fw-bold mb-3">Application Submission</h5>

            {userApplication ? (
              <div className="alert alert-success border-0 p-3 rounded-3 text-center">
                <i className="bi bi-check-circle-fill fs-2 text-success"></i>
                <h6 className="fw-bold mt-2">Application Submitted</h6>
                <p className="small text-muted mb-2">You have already applied for this opening.</p>
                <span className="badge bg-success px-3 py-2">Status: {userApplication.status}</span>
                <div className="mt-3">
                  <Link to="/student/my-applications" className="btn btn-outline-success btn-sm w-100">
                    Track in My Applications
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                {/* Eligibility Notice */}
                {!eligibilityCheck.isEligible && (
                  <div className="alert alert-warning small p-3 rounded-3 mb-3">
                    <strong><i className="bi bi-exclamation-triangle-fill me-1"></i> Eligibility Notice:</strong>
                    <ul className="mb-0 mt-1 ps-3">
                      {eligibilityCheck.reasons.map((r, idx) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-3 small text-muted">
                  <i className="bi bi-calendar-x text-danger me-1"></i> Deadline:{' '}
                  <strong>{new Date(job.deadline).toLocaleDateString()}</strong>
                </div>

                <form onSubmit={handleApply}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Note / Cover Letter (Optional)</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Highlight relevant projects, certifications or interest..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                    disabled={applying || (!eligibilityCheck.isEligible && user?.role === 'student')}
                  >
                    {applying ? (
                      <span>Submitting...</span>
                    ) : (
                      <span>
                        <i className="bi bi-send-fill me-1"></i> Submit Application
                      </span>
                    )}
                  </button>
                </form>

                {!isAuthenticated && (
                  <div className="small text-center text-muted mt-3">
                    Already registered? <Link to="/login">Sign In</Link> to apply.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
