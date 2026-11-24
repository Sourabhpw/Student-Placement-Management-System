import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Student specific fields
  const [rollNumber, setRollNumber] = useState('');
  const [course, setCourse] = useState('MCA');
  const [department, setDepartment] = useState('Computer Applications');
  const [batchYear, setBatchYear] = useState('2026');
  const [graduationCgpa, setGraduationCgpa] = useState('7.5');
  const [skills, setSkills] = useState('React.js, Node.js, JavaScript, MongoDB');

  // Recruiter specific fields
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Information Technology');
  const [location, setLocation] = useState('Bangalore, India');
  const [website, setWebsite] = useState('https://company.com');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = {
      name,
      email,
      password,
      role,
      phone,
      ...(role === 'student' && {
        rollNumber,
        course,
        department,
        batchYear: Number(batchYear),
        graduationCgpa: Number(graduationCgpa),
        skills,
      }),
      ...(role === 'recruiter' && {
        companyName,
        industry,
        location,
        website,
      }),
    };

    try {
      await register(formData);
      if (role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <span className="brand-badge fs-5 mb-2">🎓 PlacementPortal</span>
              <h3 className="fw-bold text-dark mt-2">Create New Account</h3>
              <p className="text-muted small">Choose your role and register to access campus opportunities</p>

              {/* Role Toggle */}
              <div className="btn-group w-100 mt-2" role="group">
                <button
                  type="button"
                  className={`btn py-2 ${role === 'student' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setRole('student')}
                >
                  <i className="bi bi-person-fill me-1"></i> Register as Student
                </button>
                <button
                  type="button"
                  className={`btn py-2 ${role === 'recruiter' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setRole('recruiter')}
                >
                  <i className="bi bi-building me-1"></i> Register as Recruiter
                </button>
              </div>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {role === 'student' ? (
                  <>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">University Roll Number</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. MCA2024015"
                        value={rollNumber}
                        onChange={(e) => setRollNumber(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Course / Degree</label>
                      <select
                        className="form-select"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                      >
                        <option value="MCA">Master of Computer Applications (MCA)</option>
                        <option value="B.Tech CS">B.Tech Computer Science</option>
                        <option value="BCA">Bachelor of Computer Applications (BCA)</option>
                        <option value="M.Tech">M.Tech Computer Science</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Graduation CGPA (Scale 10)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        className="form-control"
                        placeholder="8.5"
                        value={graduationCgpa}
                        onChange={(e) => setGraduationCgpa(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Passing Batch Year</label>
                      <input
                        type="number"
                        className="form-control"
                        value={batchYear}
                        onChange={(e) => setBatchYear(e.target.value)}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">Key Technical Skills (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="React.js, Node.js, Express, MongoDB, Java"
                        value={skills}
                        onChange={(e) => setSkills(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Company / Organization Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. TechCorp Solutions"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Industry Sector</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Cloud & IT Services"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">HQ / Office Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Bangalore, India"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Company Website</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://company.com"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="col-12 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                    disabled={loading}
                  >
                    {loading ? 'Creating Profile...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            </form>

            <div className="text-center mt-4 text-muted small">
              Already have an account? <Link to="/login" className="fw-semibold">Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
