import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navbar, Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
const API = process.env.REACT_APP_BACKEND_API;


function FacultyDashboard() {
  const [certList, setCertList] = useState([]);
  const [facultyName, setFacultyName] = useState('Faculty');

  // Filters
  const [regulationFilter, setRegulationFilter] = useState('');
  const [academicYearFilter, setAcademicYearFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');
  const [sortField, setSortField] = useState('');

  // Student ID Range Filters
  const [idRanges, setIdRanges] = useState([{ from: '', to: '' }]);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const semesterOptions = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8]
  };

  // Fetch Certificates
  const fetchCertificates = async () => {
    try {
      const res = await axios.get(`${API}/api/certificates`, { headers });
      setCertList(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  // Fetch Faculty Profile
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/profile`, { headers });
      setFacultyName(res.data.name || 'Faculty');
    } catch {
      console.warn('Could not load faculty profile');
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchProfile();
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/';
    }
  };

  // ✅ Apply Filters
  const filteredCerts = certList
    .filter(cert =>
      (regulationFilter ? cert.regulation === regulationFilter : true) &&
      (academicYearFilter ? cert.academicYear === academicYearFilter : true) &&
      (yearFilter ? cert.yearOfStudy === yearFilter : true) &&
      (semesterFilter ? String(cert.semester || '') === semesterFilter : true)
    )
    // ✅ Apply Student ID Ranges
    .filter(cert => {
      if (idRanges.length === 0) return true;
      return idRanges.some(range => {
        if (!range.from && !range.to) return true;
        const id = cert.studentId || '';
        return (
          (!range.from || id >= range.from) &&
          (!range.to || id <= range.to)
        );
      });
    })
    .sort((a, b) => {
      if (sortField === 'studentId') return a.studentId.localeCompare(b.studentId);
      return 0;
    });

  const resetFilters = () => {
    setRegulationFilter('');
    setAcademicYearFilter('');
    setYearFilter('');
    setSemesterFilter('');
    setSortField('');
    setIdRanges([{ from: '', to: '' }]);
  };

  const handleRangeChange = (index, field, value) => {
    const updatedRanges = [...idRanges];
    updatedRanges[index][field] = value;
    setIdRanges(updatedRanges);
  };

  const addRange = () => {
    setIdRanges([...idRanges, { from: '', to: '' }]);
  };

  return (
    <div className="bg-light min-vh-100">
      {/* ✅ Navbar */}
      <Navbar bg="white" variant="light" className="shadow-sm py-3">
        <Container className="d-flex justify-content-between align-items-center">
          <h3><i className="bi bi-person-badge fs-3 text-info"></i>
          <span className="fw-bold text-primary"> Welcome, {facultyName}</span></h3>
          <div>
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h4 className="text-center text-primary mb-4">📄 Internship Certificates (Faculty View)</h4>

        {/* ✅ Filters */}
        <Row className="mb-3 g-2">
          <Col md={2}>
            <Form.Select value={regulationFilter} onChange={(e) => setRegulationFilter(e.target.value)}>
              <option value="">Regulation</option>
              <option value="R19">R19</option>
              <option value="R20">R20</option>
              <option value="R23">R23</option>
              <option value="R26">R26</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select value={academicYearFilter} onChange={(e) => setAcademicYearFilter(e.target.value)}>
              <option value="">Academic Year</option>
              <option value="2022-23">2022-23</option>
              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
              <option value="2026-27">2026-27</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} disabled={!yearFilter}>
              <option value="">Semester</option>
              {yearFilter && semesterOptions[yearFilter]?.map((sem) => (
                <option key={sem} value={String(sem)}>Semester {sem}</option>
              ))}
            </Form.Select>
          </Col>

          <Col md={2}>
            <Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}>
              <option value="">Sort By</option>
              <option value="studentId">Student ID</option>
            </Form.Select>
          </Col>

          <Col md={2} className="d-flex gap-2">
            <Button variant="danger" onClick={resetFilters}>Reset</Button>
            <CSVLink data={filteredCerts} filename="faculty-certificates.csv" className="btn btn-outline-primary">Download CSV</CSVLink>
          </Col>
        </Row>

        {/* ✅ Dynamic Student ID Ranges */}
        <div className="mb-3 p-3 border rounded bg-white shadow-sm">
          <h6>Filter by Student ID Range</h6>
          {idRanges.map((range, index) => (
            <Row key={index} className="mb-2 g-2">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="From Student ID"
                  value={range.from}
                  onChange={(e) => handleRangeChange(index, 'from', e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="To Student ID"
                  value={range.to}
                  onChange={(e) => handleRangeChange(index, 'to', e.target.value)}
                />
              </Col>
              {index === idRanges.length - 1 && (
                <Col md={2}>
                  <Button variant="success" onClick={addRange}>+ Add</Button>
                </Col>
              )}
            </Row>
          ))}
        </div>

        {/* ✅ Table */}
        {filteredCerts.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No certificates found for the selected filters.</p>
          </div>
        ) : (
          <div className="table-responsive shadow-sm rounded">
            <Table striped bordered hover className="align-middle text-center">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Year</th>
                  <th>Semester</th>
                  <th>Title</th>
                  <th>Company</th>
                  <th>Certificate</th>
                </tr>
              </thead>
              <tbody>
                {filteredCerts.map((cert, index) => (
                  <tr key={cert._id}>
                    <td>{index + 1}</td>
                    <td>{cert.studentId}</td>
                    <td>{cert.student?.name}</td>
                    <td>{cert.student?.email}</td>
                    
                    <td>{cert.yearOfStudy}</td>
                    <td>{cert.semester}</td>
                    <td>{cert.internshipTitle}</td>
                    <td>{cert.companyName}</td>
                    <td>
                      <a href={cert.certificateURL} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
}

export default FacultyDashboard;
