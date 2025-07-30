import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import { Clipboard } from 'react-bootstrap-icons';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function InternshipStats() {
  const [certificates, setCertificates] = useState([]);
  const [filters, setFilters] = useState({ regulation: '', academicYear: '', semester: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await axios.get(`http://localhost:5000/api/certificates?${query}`, { headers });
    setCertificates(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Stats
  const total = certificates.length;
  const paid = certificates.filter(c => c.internshipPaid).length;
  const unpaid = total - paid;
  const aicte = certificates.filter(c => c.companyName === 'AICTE');
  const other = certificates.filter(c => c.companyName !== 'AICTE');

  const cohortLabels = Array.from({ length: 10 }, (_, i) => `cohort-${i + 6}`);
  const cohortCounts = cohortLabels.reduce((acc, cohort) => {
    acc[cohort] = aicte.filter(c => c.cohort === cohort).length;
    return acc;
  }, {});

  const paidUnpaidByYear = [1, 2, 3, 4].map(year => {
    const certs = certificates.filter(c => parseInt(c.yearOfStudy) === year);
    return {
      year: `${year} Year`,
      paid: certs.filter(c => c.internshipPaid).length,
      unpaid: certs.filter(c => !c.internshipPaid).length,
      studentIds: certs.map(c => c.studentId).filter(Boolean)
    };
  });

  const barChartData = {
    labels: paidUnpaidByYear.map(d => d.year),
    datasets: [
      { label: 'Paid', data: paidUnpaidByYear.map(d => d.paid), backgroundColor: '#198754' },
      { label: 'Unpaid', data: paidUnpaidByYear.map(d => d.unpaid), backgroundColor: '#dc3545' }
    ]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } };

  const pieData = { labels: ['Paid', 'Unpaid'], datasets: [{ data: [paid, unpaid], backgroundColor: ['#198754', '#dc3545'] }] };

  const cohortPie = {
    labels: cohortLabels,
    datasets: [{ data: cohortLabels.map(c => cohortCounts[c]), backgroundColor: cohortLabels.map(() => getRandomColor()) }]
  };

  function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  const yearWisePieCharts = paidUnpaidByYear.map(({ year, paid, unpaid, studentIds }) => ({
    year,
    data: { labels: ['Paid', 'Unpaid'], datasets: [{ data: [paid, unpaid], backgroundColor: ['#198754', '#dc3545'] }] },
    studentIds
  }));

  const companiesMap = other.reduce((acc, curr) => {
    acc[curr.companyName] = (acc[curr.companyName] || 0) + 1;
    return acc;
  }, {});

  const companyWiseBarData = {
    labels: Object.keys(companiesMap),
    datasets: [{ label: 'Students per Company', data: Object.values(companiesMap), backgroundColor: Object.keys(companiesMap).map(() => getRandomColor()) }]
  };

  const handleCopyIds = (ids) => {
    navigator.clipboard.writeText(ids.join(', '));
    alert(`Copied ${ids.length} IDs`);
  };

  return (
    <Container className="py-4">
      <Button className="mb-3" variant="secondary" onClick={() => navigate('/dashboard/admin')}>
        ← Back to Dashboard
      </Button>
      <h2 className="mb-4 text-center text-primary">📊 Internship Statistics</h2>

      {/* ✅ Filters */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Select name="regulation" value={filters.regulation} onChange={handleFilterChange}>
            <option value="">All Regulations</option>
            <option value="R19">R19</option>
            <option value="R20">R20</option>
            <option value="R23">R23</option>
            <option value="R26">R26</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select name="academicYear" value={filters.academicYear} onChange={handleFilterChange}>
            <option value="">All Academic Years</option>
            <option value="2022-23">2022-23</option>
            <option value="2023-24">2023-24</option>
            <option value="2024-25">2024-25</option>
            <option value="2025-26">2025-26</option>
            <option value="2026-27">2026-27</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select name="semester" value={filters.semester} onChange={handleFilterChange}>
            <option value="">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
          </Form.Select>
        </Col>
      </Row>

      {/* ✅ Charts */}
      <Row className="mb-4 text-center">
        <Col><Card body className="bg-light border-primary"><h5>Total</h5><h4>{total}</h4></Card></Col>
        <Col><Card body className="bg-light border-success"><h5>Paid</h5><h4>{paid}</h4></Card></Col>
        <Col><Card body className="bg-light border-danger"><h5>Unpaid</h5><h4>{unpaid}</h4></Card></Col>
        <Col><Card body className="bg-light border-info"><h5>AICTE</h5><h4>{aicte.length}</h4></Card></Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}><Card><Card.Body><h5 className="text-center">Paid vs Unpaid</h5><div style={{ height: '250px' }}><Pie data={pieData} options={chartOptions} /></div></Card.Body></Card></Col>
        <Col md={6}><Card><Card.Body><h5 className="text-center">AICTE Cohorts (6–15)</h5><div style={{ height: '250px' }}><Pie data={cohortPie} options={chartOptions} /></div></Card.Body></Card></Col>
      </Row>

      <Row className="mb-4">
        <Col md={12}><Card><Card.Body><h5 className="text-center">Year-wise Paid vs Unpaid</h5><div style={{ height: '300px' }}><Bar data={barChartData} options={chartOptions} /></div></Card.Body></Card></Col>
      </Row>

      <Row>
        {yearWisePieCharts.map(({ year, data, studentIds }) => (
          <Col md={6} key={year} className="mb-3">
            <Card><Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>{year}</h5>
                <Button size="sm" onClick={() => handleCopyIds(studentIds)}><Clipboard /></Button>
              </div>
              <div style={{ height: '250px' }}><Pie data={data} options={chartOptions} /></div>
            </Card.Body></Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        <Col md={12}><Card><Card.Body><h5>🏢 Company-wise Student Count</h5><div style={{ height: '300px' }}><Bar data={companyWiseBarData} options={chartOptions} /></div></Card.Body></Card></Col>
      </Row>
    </Container>
  );
}
