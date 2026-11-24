import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.user.role === 'recruiter') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@college.edu');
      setPassword('Admin@123');
    } else if (role === 'recruiter') {
      setEmail('recruiter@infosys.com');
      setPassword('Recruiter@123');
    } else if (role === 'student') {
      setEmail('sourabh@student.edu');
      setPassword('Student@123');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <span className="brand-badge fs-5 mb-2">🎓 PlacementPortal</span>
              <h3 className="fw-bold text-dark mt-2">Sign In</h3>
              <p className="text-muted small">Enter your credentials to access your dashboard</p>
            </div>

            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="name@college.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-light"><i className="bi bi-lock"></i></span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold mt-2 shadow-sm"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            {/* Quick Demo Logins Helper */}
            <div className="mt-4 pt-3 border-top">
              <div className="small text-muted text-center mb-2 fw-semibold">Click to Fill Demo Credentials:</div>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => fillDemoCredentials('admin')}
                >
                  Admin
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => fillDemoCredentials('recruiter')}
                >
                  Recruiter
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={() => fillDemoCredentials('student')}
                >
                  Student
                </button>
              </div>
            </div>

            <div className="text-center mt-4 text-muted small">
              Don't have an account? <Link to="/register" className="fw-semibold">Register here</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
