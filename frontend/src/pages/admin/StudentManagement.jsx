import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api, { SERVER_BASE_URL } from '../../services/api';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [placementStatus, setPlacementStatus] = useState('');
  const [loading, setLoading] = useState(true);

  // New Student Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'Student@123',
    phone: '',
    rollNumber: '',
    department: 'Computer Applications',
    course: 'MCA',
    batchYear: 2026,
    graduationCgpa: 8.0,
    skills: 'React.js, Node.js, SQL',
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let params = [];
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (department) params.push(`department=${encodeURIComponent(department)}`);
      if (placementStatus) params.push(`placementStatus=${encodeURIComponent(placementStatus)}`);

      const query = params.length ? `?${params.join('&')}` : '';
      const res = await api.get(`/students${query}`);
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department, placementStatus]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student and their account?')) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting student');
      }
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        academicDetails: {
          graduationCgpa: Number(formData.graduationCgpa),
          tenthPercentage: 75,
          twelfthPercentage: 75,
        },
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };
      await api.post('/students', payload);
      setShowModal(false);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add student');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar role="admin" />

      <div className="dashboard-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Student Management Directory</h3>
            <p className="text-muted small mb-0">Add, view, filter academic records and placement statuses</p>
          </div>
          <button className="btn btn-primary btn-sm shadow-sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-person-plus-fill me-1"></i> Add New Student
          </button>
        </div>

        {/* Filter Bar */}
        <div className="card border-0 shadow-sm p-3 rounded-4 bg-white mb-4">
          <div className="row g-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, roll no, email, skill..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Computer Applications">Computer Applications</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select"
                value={placementStatus}
                onChange={(e) => setPlacementStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Unplaced">Unplaced</option>
                <option value="Placed">Placed</option>
              </select>
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-outline-primary" onClick={fetchStudents}>
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Student Records Table */}
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
                    <th>Roll No</th>
                    <th>Student Name</th>
                    <th>Course</th>
                    <th>CGPA</th>
                    <th>Skills</th>
                    <th>Status</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => (
                    <tr key={st._id}>
                      <td className="fw-bold text-dark">{st.rollNumber}</td>
                      <td>
                        <div className="fw-semibold text-dark">{st.user?.name}</div>
                        <div className="small text-muted">{st.user?.email}</div>
                      </td>
                      <td>{st.course} ({st.batchYear})</td>
                      <td className="fw-bold text-primary">{st.academicDetails?.graduationCgpa}</td>
                      <td>
                        <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '200px' }}>
                          {st.skills?.slice(0, 3).map((s, idx) => (
                            <span key={idx} className="badge bg-light text-secondary border small">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${st.placementStatus === 'Placed' ? 'bg-success' : 'bg-secondary'}`}>
                          {st.placementStatus}
                        </span>
                      </td>
                      <td>
                        {st.resumeUrl ? (
                          <a
                            href={`${SERVER_BASE_URL}${st.resumeUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-light border text-danger"
                          >
                            <i className="bi bi-file-earmark-pdf"></i> View
                          </a>
                        ) : (
                          <span className="small text-muted">No resume</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(st._id)}
                          title="Delete Student"
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

        {/* Add Student Modal */}
        {showModal && (
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content rounded-4 border-0 p-3">
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold">Enroll New Student</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <form onSubmit={handleCreateSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Roll Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.rollNumber}
                          onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Course / Degree</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.course}
                          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Graduation CGPA</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={formData.graduationCgpa}
                          onChange={(e) => setFormData({ ...formData, graduationCgpa: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Batch Year</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.batchYear}
                          onChange={(e) => setFormData({ ...formData, batchYear: e.target.value })}
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small fw-semibold">Skills (Comma-separated)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.skills}
                          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary px-4">
                      Create Student
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

export default StudentManagement;
