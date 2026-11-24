import React, { useState } from 'react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
            <div className="text-center mb-4">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
                Placement Support Desk
              </span>
              <h3 className="fw-bold text-dark">Get in Touch with T&P Cell</h3>
              <p className="text-muted small">
                Have questions regarding placement drives, student registration, or corporate recruiter partnerships?
              </p>
            </div>

            {submitted ? (
              <div className="alert alert-success p-4 rounded-3 text-center">
                <i className="bi bi-check-circle-fill fs-1 text-success"></i>
                <h5 className="fw-bold mt-2">Message Sent Successfully!</h5>
                <p className="text-muted small mb-0">
                  Thank you for reaching out. The Training and Placement officer will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Your Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-semibold">Your Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold shadow-sm">
                      Send Message to Placement Desk
                    </button>
                  </div>
                </div>
              </form>
            )}

            <hr className="my-4 text-muted opacity-25" />

            <div className="row text-center text-muted small g-3">
              <div className="col-md-4">
                <i className="bi bi-geo-alt text-primary fs-5 d-block mb-1"></i>
                Training & Placement Cell, Campus Block 4
              </div>
              <div className="col-md-4">
                <i className="bi bi-envelope text-primary fs-5 d-block mb-1"></i>
                placements@college.edu
              </div>
              <div className="col-md-4">
                <i className="bi bi-telephone text-primary fs-5 d-block mb-1"></i>
                +91 (0) 1234-567890
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
