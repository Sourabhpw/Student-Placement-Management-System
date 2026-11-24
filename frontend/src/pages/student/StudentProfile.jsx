import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../services/api';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [alert, setAlert] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [tenthPercentage, setTenthPercentage] = useState('');
  const [twelfthPercentage, setTwelfthPercentage] = useState('');
  const [graduationCgpa, setGraduationCgpa] = useState('');
  const [activeBacklogs, setActiveBacklogs] = useState('');
  const [skills, setSkills] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const fetchProfile = async () => {
    try {
      const res = await api.get('/students/profile');
      if (res.data.success) {
        const data = res.data.data;
        setStudent(data);
        setName(data.user?.name || '');
        setPhone(data.user?.phone || '');
        setRollNumber(data.rollNumber || '');
        setDepartment(data.department || '');
        setCourse(data.course || '');
        setBatchYear(data.batchYear || '');
        setTenthPercentage(data.academicDetails?.tenthPercentage || '');
        setTwelfthPercentage(data.academicDetails?.twelfthPercentage || '');
        setGraduationCgpa(data.academicDetails?.graduationCgpa || '');
        setActiveBacklogs(data.academicDetails?.activeBacklogs || 0);
        setSkills(data.skills ? data.skills.join(', ') : '');
        setLinkedinUrl(data.linkedinUrl || '');
        setGithubUrl(data.githubUrl || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setAlert(null);

    const payload = {
      name,
      phone,
      rollNumber,
      department,
      course,
      batchYear: Number(batchYear),
      academicDetails: {
        tenthPercentage: Number(tenthPercentage),
        twelfthPercentage: Number(twelfthPercentage),
        graduationCgpa: Number(graduationCgpa),
        activeBacklogs: Number(activeBacklogs),
      },
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      linkedinUrl,
      githubUrl,
    };

    try {
      const res = await api.put('/students/profile', payload);
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Profile updated successfully!' });
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

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);

    setUploadingResume(true);
    setAlert(null);

    try {
      const res = await api.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setAlert({ type: 'success', message: 'Resume uploaded successfully!' });
        fetchProfile();
      }
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to upload resume',
      });
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <Sidebar role="student" />
        <div className="dashboard-content text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar role="student" />

      <div className="dashboard-content">
        <div className="mb-4">
          <h3 className="fw-bold text-dark mb-1">My Academic Profile</h3>
          <p className="text-muted small">Keep your profile and resume updated for automated recruiter screening</p>
        </div>

        {alert && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            {alert.message}
            <button type="button" className="btn-close" onClick={() => setAlert(null)}></button>
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Form Details */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
              <form onSubmit={handleUpdate}>
                <h5 className="fw-bold mb-3 text-dark">Personal Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Email Address (Read-only)</label>
                    <input
                      type="text"
                      className="form-control bg-light"
                      value={student?.user?.email || ''}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Roll Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <h5 className="fw-bold mb-3 text-dark">Academic Qualifications</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Degree / Course</label>
                    <input
                      type="text"
                      className="form-control"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-semibold">Batch Year</label>
                    <input
                      type="number"
                      className="form-control"
                      value={batchYear}
                      onChange={(e) => setBatchYear(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">10th %</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={tenthPercentage}
                      onChange={(e) => setTenthPercentage(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">12th %</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={twelfthPercentage}
                      onChange={(e) => setTwelfthPercentage(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Graduation CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={graduationCgpa}
                      onChange={(e) => setGraduationCgpa(e.target.value)}
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-semibold">Active Backlogs</label>
                    <input
                      type="number"
                      className="form-control"
                      value={activeBacklogs}
                      onChange={(e) => setActiveBacklogs(e.target.value)}
                    />
                  </div>
                </div>

                <h5 className="fw-bold mb-3 text-dark">Technical Skills & Portfolios</h5>
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Skills (Comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="React.js, Node.js, Express, MongoDB, Java, Python"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">GitHub Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Resume & Quick Overview */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white mb-4">
              <h5 className="fw-bold text-dark mb-3">Resume Document</h5>
              {student?.resumeUrl ? (
                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <i className="bi bi-file-earmark-pdf-fill text-danger fs-1"></i>
                    <div className="overflow-hidden">
                      <div className="fw-bold text-dark text-truncate small">
                        {student.resumeOriginalName || 'Resume.pdf'}
                      </div>
                      <span className="badge bg-success-subtle text-success small">Uploaded</span>
                    </div>
                  </div>
                  <a
                    href={`http://localhost:5000${student.resumeUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary btn-sm w-100 mt-3"
                  >
                    <i className="bi bi-eye me-1"></i> View Resume
                  </a>
                </div>
              ) : (
                <div className="alert alert-warning small p-3 rounded-3 mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i> No resume uploaded. Companies require a PDF resume for screening.
                </div>
              )}

              <div>
                <label className="form-label small fw-semibold">Upload New Resume (PDF, max 5MB)</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  disabled={uploadingResume}
                />
                {uploadingResume && (
                  <div className="small text-muted mt-2">
                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                    Uploading document...
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold mb-3 text-dark">Placement Status</h6>
              <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3">
                <span className="fw-medium">Current Status</span>
                <span className={`badge px-3 py-2 ${student?.placementStatus === 'Placed' ? 'bg-success' : 'bg-primary'}`}>
                  {student?.placementStatus || 'Unplaced'}
                </span>
              </div>
              {student?.placedCompany && (
                <div className="mt-3 p-3 bg-success-subtle text-success rounded-3 small">
                  <strong>Placed at:</strong> {student.placedCompany.name} (₹ {student.placedPackageLPA} LPA)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
