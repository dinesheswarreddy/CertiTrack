import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table, Navbar, Container } from 'react-bootstrap';
import Notifications from './Notifications';

function StudentDashboard() {
  const [certList, setCertList] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    academicYear: '',
    yearOfStudy: '',
    semester: '',
    internshipTitle: '',
    companyName: '',
    internshipType: '',
    internshipPaid: false,
    stipendAmount: '',
    startDate: '',
    endDate: '',
    certificateURL: '',
    cohort: '',
    companyType: ''
  });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [studentName, setStudentName] = useState('Student');
  const [studentRegulation, setStudentRegulation] = useState('');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const semesterOptions = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8]
  };

  const fetchCertificates = async () => {
    const res = await axios.get('http://localhost:5000/api/certificates/mine', { headers });
    setCertList(res.data);
  };

  const fetchProfile = async () => {
    const res = await axios.get('http://localhost:5000/api/auth/profile', { headers });
    setStudentName(res.data.name || 'Student');
    setStudentRegulation(res.data.regulation || '');
  };

  useEffect(() => {
    fetchCertificates();
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert('You are not logged in. Please login again.');
      handleLogout();
      return;
    }

    const payload = { ...formData, regulation: studentRegulation };
  

    if (formData.companyType === 'AICTE') {
      payload.companyName = 'AICTE';
      if (!payload.cohort) {
        alert('Please select a cohort for AICTE.');
        return;
      }
    } else {
      delete payload.cohort;
      if (!payload.companyName) {
        alert('Please enter company name.');
        return;
      }
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/certificates/${editId}`, payload, { headers });
      } else {
        await axios.post('http://localhost:5000/api/certificates', payload, { headers });
      }

      fetchCertificates();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Submission failed. Please check your form or try again later.");
    }
  };
  const handleEdit = (cert) => {
  if (!cert._id) {
    alert('Invalid certificate ID');
    return;
  }
  const updatedData = { ...cert };
  updatedData.companyType = cert.companyName === 'AICTE' ? 'AICTE' : 'Other';
  setFormData(updatedData);
  setEditId(cert._id);
  setShowForm(true);
};

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this certificate?')) {
    await axios.delete(`http://localhost:5000/api/certificates/${id}`, { headers });
    fetchCertificates();
  }
};
  const resetForm = () => {
    setFormData({
      studentId: '',
      academicYear: '',
      yearOfStudy: '',
      semester: '',
      internshipTitle: '',
      companyName: '',
      internshipType: '',
      internshipPaid: false,
      stipendAmount: '',
      startDate: '',
      endDate: '',
      certificateURL: '',
      cohort: '',
      companyType: ''
    });
    setEditId(null);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
    }
  };

  return (
    <div className="bg-light min-vh-100">
      <Navbar bg="white" variant="light" className="shadow-sm py-3">
        <Container className="d-flex justify-content-between align-items-center">
          <h2><i className="bi bi-mortarboard-fill fs-2 text-dark"></i>
          <span className="fw-bold text-primary">Welcome, {studentName}</span></h2>
          <div>
            <Button variant="success" className="me-2" onClick={() => { resetForm();setShowForm(true);}}>Upload Certificate</Button>
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Container>
      </Navbar>
      <Notifications />
<Container className="mt-4">
  <h4 className="text-center mb-3 text-primary">Your Internship Completion Certificates</h4>
  {certList.length === 0 ? (
    <div className="text-center text-muted py-5">
      <p>No certificates added yet.</p>
    </div>
  ) : (
    <div className="table-responsive shadow-sm rounded">
      <Table striped bordered hover className="align-middle text-center">
        <thead className="table-primary">
          <tr>
            <th style={{ width: "50px" }}>#</th>
            <th style={{ minWidth: "150px" }}>Title</th>
            <th style={{ minWidth: "120px" }}>Company</th>
            <th>Cohort</th>
            {/* <th>Regulation</th>
            <th>Academic Year</th> */}
            <th>Year</th>
            <th>Sem</th>
            <th>Type</th>
            <th>Stipend</th>
            <th style={{ minWidth: "150px" }}>Period</th>
            <th style={{ minWidth: "100px" }}>Certificate</th>
            <th style={{ width: "130px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certList.map((cert, index) => (
            <tr key={cert._id}>
              <td>{index + 1}</td>
              <td className="text-truncate" style={{ maxWidth: "150px" }} title={cert.internshipTitle}>
                {cert.internshipTitle}
              </td>
              <td>{cert.companyName}</td>
              <td>{cert.cohort || "-"}</td>
              {/* <td>{cert.regulation}</td>
              <td>{cert.academicYear}</td> */}
              <td>{cert.yearOfStudy}</td>
              <td>{cert.semester}</td>
              <td>{cert.internshipType}</td>
              <td>{cert.internshipPaid ? `₹${cert.stipendAmount}` : "Unpaid"}</td>
              <td className='small'>
                {cert.startDate?.substring(0, 10)} <br /> to <br />{cert.endDate?.substring(0, 10)}
              </td>
              <td>
                <a
                  href={cert.certificateURL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-primary btn-sm"
                >
                  View
                </a>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => handleEdit(cert)}
                    title="Edit Certificate"
                  >
                    ✏️
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(cert._id)}
                    title="Delete Certificate"
                  >
                    🗑️
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )}
</Container>


      <Modal show={showForm} onHide={() => setShowForm(false)&& resetForm()}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit Certificate' : 'Add Certificate'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit} className="p-3">
          <Form.Group className="mb-2">
            <Form.Control placeholder="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} required />
          </Form.Group>

          {/* Academic Year */}
          <Form.Group className="mb-2">
            <Form.Select name="academicYear" value={formData.academicYear} onChange={handleChange} required>
              <option value="">Select Academic Year</option>
              <option value="2022-23">2022-23</option>
              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
              <option value="2027-28">2027-28</option>
            </Form.Select>
          </Form.Group>

          {/* Year of Study */}
          <Form.Group className="mb-2">
            <Form.Select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} required>
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </Form.Select>
          </Form.Group>

          {/* Semester */}
          {formData.yearOfStudy && (
            <Form.Group className="mb-2">
              <Form.Select name="semester" value={formData.semester} onChange={handleChange} required>
                <option value="">Select Semester</option>
                {semesterOptions[formData.yearOfStudy]?.map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Internship Title */}
          <Form.Group className="mb-2">
            <Form.Control placeholder="Internship Title" name="internshipTitle" value={formData.internshipTitle} onChange={handleChange} required />
          </Form.Group>

          {/* Company Type */}
          <Form.Group className="mb-2">
            <Form.Select name="companyType" value={formData.companyType} onChange={handleChange} required>
              <option value="">Select Company Type</option>
              <option value="AICTE">AICTE</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          {/* AICTE Cohorts */}
          {formData.companyType === 'AICTE' && (
            <Form.Group className="mb-2">
              <Form.Select name="cohort" value={formData.cohort} onChange={handleChange} required>
                <option value="">Select Cohort</option>
                {Array.from({ length: 9 }, (_, i) => i + 7).map(num => (
                  <option key={num} value={`cohort-${num}`}>Cohort-{num}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}

          {/* Company Name for Other */}
          {formData.companyType === 'Other' && (
            <Form.Group className="mb-2">
              <Form.Control placeholder="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
            </Form.Group>
          )}

          {/* Internship Type */}
          <Form.Group className="mb-2">
            <Form.Select name="internshipType" value={formData.internshipType} onChange={handleChange} required>
              <option value="">Select Internship Type</option>
              <option value="In-office">In-office</option>
              <option value="Remote">Remote</option>
            </Form.Select>
          </Form.Group>

          {/* Paid Internship */}
          <Form.Group className="mb-2">
            <Form.Check type="checkbox" label="Paid Internship" name="internshipPaid" checked={formData.internshipPaid} onChange={handleChange} />
          </Form.Group>

          {/* Stipend Amount */}
          {formData.internshipPaid && (
            <Form.Group className="mb-2">
              <Form.Control placeholder="Stipend Amount" name="stipendAmount" value={formData.stipendAmount} onChange={handleChange} required />
            </Form.Group>
          )}

          {/* Dates */}
          <Form.Group className="mb-2">
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
          </Form.Group>

          {/* Certificate URL */}
          <Form.Group className="mb-3">
            <Form.Control placeholder="Certificate URL" name="certificateURL" value={formData.certificateURL} onChange={handleChange} required />
          </Form.Group>

          <Button type="submit" className="w-100" variant="primary">{editId ? 'Update' : 'Submit'}</Button>
        </Form>
      </Modal>
    </div>
  );
}

export default StudentDashboard;
