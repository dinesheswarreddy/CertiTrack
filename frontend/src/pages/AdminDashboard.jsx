// ✅ Updated AdminDashboard.jsx: includes enhanced features from previous Firebase-based version

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationBoard from './NotificationBoard';
import { Table, Container, Navbar, Button, Form, Row, Col,Modal } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import 'bootstrap-icons/font/bootstrap-icons.css';
import {Card} from '../components/ui/Card';
import { useNavigate } from "react-router-dom";
function AdminDashboard() {
  const [certList, setCertList] = useState([]);
  const [adminName, setAdminName] = useState('Admin');
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [regulationFilter, setRegulationFilter] = useState("");
  const [academicYearFilter, setAcademicYearFilter] = useState("");
   const [yearFilter, setYearFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [sortField, setSortField] = useState('');
  const [companyFilter, setCompanyFilter] = useState("");
  
  const [typeFilter, setTypeFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [cohortFilter, setCohortFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();
  

  const semesterOptions = {
    1: [1, 2],
    2: [3, 4],
    3: [5, 6],
    4: [7, 8],
  };

  const fetchCertificates = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/certificates', { headers });
      setCertList(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', { headers });
      setAdminName(res.data.name || 'Admin');
    } catch {
      console.warn('Could not load admin profile');
    }
  };

  useEffect(() => {
    fetchCertificates();
    fetchProfile();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/";
    }
  };

  // const filteredAndSortedCerts = certList
  //   .filter(cert => {
  //     const search = searchTerm.toLowerCase();
  //     const matchesSearch = Object.values(cert).some(value =>
  //       String(value).toLowerCase().includes(search)
  //     );
  //     const matchesYear = yearFilter ? cert.yearOfStudy === yearFilter : true;
  //     const matchesCohort = cohortFilter ? cert.cohort === cohortFilter : true;
  //     const matchesType =
  //       typeFilter === 'paid' ? cert.internshipPaid :
  //       typeFilter === 'unpaid' ? !cert.internshipPaid : true;
  //     const matchesStartDate = startDateFilter ? new Date(cert.startDate) >= new Date(startDateFilter) : true;
  //     const matchesEndDate = endDateFilter ? new Date(cert.endDate) <= new Date(endDateFilter) : true;
  //     return matchesSearch && matchesYear && matchesCohort && matchesType && matchesStartDate && matchesEndDate;
  //   })
  //   .sort((a, b) => {
  //     if (!sortField) return 0;
  //     const aVal = a[sortField];
  //     const bVal = b[sortField];
  //     if (sortField === 'internshipPaid') return aVal === bVal ? 0 : aVal ? -1 : 1;
  //     if (typeof aVal === 'string' && typeof bVal === 'string') return aVal.localeCompare(bVal);
  //     return 0;
  //   });


const filteredAndSortedCerts = certList
  .filter((cert) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch = searchTerm
      ? Object.values(cert).some((val) =>
          String(val).toLowerCase().includes(search)
        )
      : true;

    const matchesRegulation = regulationFilter
      ? cert.regulation === regulationFilter
      : true;

    const matchesYear = yearFilter
      ? cert.yearOfStudy === yearFilter
      : true;

    const matchesSemester = semesterFilter
      ? String(cert.semester) === semesterFilter
      : true;

    const matchesAcademicYear = academicYearFilter
      ? cert.academicYear === academicYearFilter
      : true;

    const matchesCompany = companyFilter
      ? cert.companyName === companyFilter
      : true;

    const matchesCohort = cohortFilter
      ? cert.cohort === cohortFilter
      : true;

    const matchesType =
      typeFilter === "paid"
        ? cert.internshipPaid
        : typeFilter === "unpaid"
        ? !cert.internshipPaid
        : true;

    const matchesStartDate = startDateFilter
      ? new Date(cert.startDate) >= new Date(startDateFilter)
      : true;

    const matchesEndDate = endDateFilter
      ? new Date(cert.endDate) <= new Date(endDateFilter)
      : true;

    return (
      matchesSearch &&
      matchesRegulation &&
      matchesYear &&
      matchesSemester &&
      matchesAcademicYear &&
      matchesCompany &&
      matchesCohort &&
      matchesType &&
      matchesStartDate &&
      matchesEndDate
    );
  })
  .sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortField === "internshipPaid")
      return aVal === bVal ? 0 : aVal ? -1 : 1;

    if (typeof aVal === "string" && typeof bVal === "string")
      return aVal.localeCompare(bVal);

    return 0;
  });






  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredAndSortedCerts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAndSortedCerts.length / itemsPerPage);

  const resetFilters = () => {
    setSearchTerm('');
    setSortField('');
    setRegulationFilter("");
    setYearFilter("");
    setSemesterFilter("");
    setAcademicYearFilter("");
    setCompanyFilter("");
    setTypeFilter('');
    setStartDateFilter('');
    setEndDateFilter('');
    setCohortFilter('');
    setCurrentPage(1);
  };








  return (
    <div className="bg-light min-vh-100">
      <Navbar bg="white" variant="light" className="shadow-sm py-3">
        <Container className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            
            <h3><i className="bi bi-shield-lock-fill fs-3 text-danger"></i>
            <span className="fw-bold text-primary">Welcome, {adminName}</span></h3>
          </div>
          <div>
            <Button href="/notification-board" className="me-2" variant="dark">Post Notification</Button>
            <Button href="/signup/faculty" className="me-2" variant="success">Add Faculty</Button>
            <Button href="/stats" className="me-2" variant="warning">Internship Stats</Button>
            <Button variant="outline-danger" onClick={handleLogout}>Logout</Button>
          </div>
        </Container>
      </Navbar>


      <Container className="mt-4">
        <h3 className="text-primary mt-5 mb-3">📄 Internship Certificates</h3>
        <Row className="mb-3 g-2">
          <Col md={15}><Form.Control type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></Col>
        </Row><Row className="mb-3 g-2">
          <Col md={3}>
            <Form.Select
              value={regulationFilter}
              onChange={(e) => setRegulationFilter(e.target.value)}
            >
              <option value="">Regulation</option>
              <option value="R19">R19</option>
              <option value="R20">R20</option>
              <option value="R21">R23</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={academicYearFilter}
              onChange={(e) => setAcademicYearFilter(e.target.value)}
            >
              <option value="">Academic Year</option>
              <option value="2023-24">2023-24</option>
              <option value="2024-25">2024-25</option>
              <option value="2025-26">2025-26</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setSemesterFilter("");
              }}
            >
              <option value="">Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
              disabled={!yearFilter}
            >
              <option value="">Semester</option>
              {yearFilter &&
                semesterOptions[yearFilter]?.map((sem) => (
                  <option key={sem} value={String(sem)}>
                    Semester {sem}
                  </option>
                ))}
            </Form.Select>
          </Col> <br/></Row><Row className="mb-3 g-2">
          <Col md={2}><Form.Select value={sortField} onChange={(e) => setSortField(e.target.value)}><option value="">Sort By</option><option value="yearOfStudy">Year</option><option value="studentId">Student ID</option><option value="student.name">Name</option><option value="companyName">Company</option><option value="startDate">Start</option><option value="endDate">End</option><option value="internshipPaid">Paid/Unpaid</option></Form.Select></Col>
          {/* <Col md={1}><Form.Select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}><option value="">Year</option><option value="1">1st</option><option value="2">2nd</option><option value="3">3rd</option><option value="4">4th</option></Form.Select></Col> */}
          <Col md={2}><Form.Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}><option value="">All Types</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option></Form.Select></Col>
          <Col md={1} >Start Date -</Col>
          <Col md={2}><Form.Control type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} /></Col>
          <Col md={1}>End Date -</Col>
          <Col md={2}><Form.Control type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} /></Col>
          <Col md={2}><Form.Select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)}>
  <option value="">All Cohorts</option>
  {Array.from({ length: 10 }, (_, i) => (
    <option key={i} value={`cohort-${i + 6}`}>
      Cohort-{i + 6}
    </option>
  ))}
</Form.Select>
</Col>
        </Row>

        <Row className="mb-4 g-2">
          <Col><Button onClick={resetFilters} variant="danger">🔄 Reset All</Button></Col>
          <Col className="text-end">
            <CSVLink data={certList} filename="certificates.csv" className="btn btn-outline-primary">⬇️ Download CSV</CSVLink>
          </Col>
        </Row>

        {currentItems.length === 0 ? (
          <div className="text-center text-muted py-5">
            <p>No certificate data available.</p>
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead className="table-primary">
              <tr>
                <th>S.No</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Year</th>
                <th>Title</th>
                <th>Company</th>
                <th>Cohort</th>
                <th>Type</th>
                <th>Stipend</th>
                <th>Period</th>
                <th>Certificate</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((cert, index) => (
                <tr key={cert._id}>
                  <td>{indexOfFirst + index + 1}</td>
                  <td>{cert.studentId}</td>
                  <td>{cert.student?.name}</td>
                  <td>{cert.student?.email}</td>
                  <td>{cert.yearOfStudy}</td>
                  <td>{cert.internshipTitle}</td>
                  <td>{cert.companyName}</td>
                  <td>{cert.cohort || '-'}</td>
                  <td>{cert.internshipType}</td>
                  <td>{cert.internshipPaid ? `₹${cert.stipendAmount}` : 'Unpaid'}</td>
                  <td>{cert.startDate?.substring(0, 10)} to {cert.endDate?.substring(0, 10)}</td>
                  <td><a href={cert.certificateURL} target="_blank" rel="noreferrer">View</a></td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div className="pagination-controls d-flex justify-content-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={i + 1 === currentPage ? 'primary' : 'outline-primary'}
              className="mx-1"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </Container>
    </div>
    
  );
}

export default AdminDashboard;
