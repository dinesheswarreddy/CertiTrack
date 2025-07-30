import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import {
  FileText,
  Menu,
  Users,
  GraduationCap,
  Shield,
  CheckCircle,
  TrendingUp,
  Award,
  BarChart3
} from 'lucide-react';

export default function CertiTrackHome() {
  const [showMenu, setShowMenu] = useState(false);
  const [userCounts, setUserCounts] = useState({ students: 0, faculty: 0 });
  useEffect(() => {
const fetchCounts = async () => {
try {
const res = await axios.get('http://localhost:5000/api/users/role-count');
setUserCounts(res.data);
} catch (err) {
console.error('Failed to fetch user counts:', err);
}
};
fetchCounts();
}, []);

  const features = [
    {
      icon: <CheckCircle size={32} className="text-primary" />,
      title: "Real-time Tracking",
      description: "Monitor student certification progress with instant updates and notifications."
    },
    {
      icon: <Users size={32} className="text-primary" />,
      title: "Multi-role Access",
      description: "Students, faculty, and administrators access with role-based permissions."
    },
    {
      icon: <BarChart3 size={32} className="text-primary" />,
      title: "Advanced Analytics",
      description: "Detailed reporting and analytics to track trends and metrics."
    },
    {
      icon: <Shield size={32} className="text-primary" />,
      title: "Secure & Reliable",
      description: "Robust cloud infrastructure and enterprise-grade data protection."
    }
  ];

  const stats = [
    { label: "Active Students", value: "2,500+", icon: <GraduationCap size={24} /> },
    { label: "Certifications Tracked", value: "10,000+", icon: <Award size={24} /> },
    { label: "Faculty Members", value: "150+", icon: <Users size={24} /> },
    { label: "Success Rate", value: "98%", icon: <TrendingUp size={24} /> }
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <FileText className="me-2" />
            <h2><em>CertiTrack</em></h2>
          </Link>

          <div className="d-flex align-items-center">
            <Link to="/login/student" className="btn btn-outline-primary me-2">Student Login</Link>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                onClick={() => setShowMenu(!showMenu)}
              >
                
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${showMenu ? 'show' : ''}`}>
                <li>
                  <Link to="/login/faculty" className="dropdown-item d-flex align-items-center">
                    <Users size={16} className="me-2" /> Faculty Login
                  </Link>
                </li>
                <li>
                  <Link to="/login/admin" className="dropdown-item d-flex align-items-center">
                    <Shield size={16} className="me-2" /> Admin Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <Badge variant="secondary" className="mb-2 d-inline-flex align-items-center">
                <TrendingUp size={12} className="me-1" />
                Next-Gen Education Management
              </Badge>
              <h1 className="display-4 fw-bold">
                Track Student <span className="text-primary">Certifications</span>
              </h1>
              <p className="lead text-muted">
                {/* CertiTrack helps institutions manage and monitor student certification progress efficiently. */}
                CertiTrack helps institutions to Centralize internship & Certificate Completion data and make analytics effortless.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to="/login/student" className="btn btn-primary">
                  <GraduationCap size={16} className="me-2" />
                  Get Started
                </Link>
                {/* <Button variant="outline">Learn More</Button> */}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <img
              src="/home.jpg"
                alt="dashboard"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* <section className="py-5">
        <div className="container">
          <div className="row text-center g-4">
            {stats.map((stat, i) => (
              <div className="col-6 col-lg-3" key={i}>
                <Card className="h-100 p-3">
                  <div className="text-primary mb-2">{stat.icon}</div>
                  <h3>{stat.value}</h3>
                  <p className="text-muted small">{stat.label}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features */}
      {/* <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <Badge variant="secondary" className="mb-2 d-inline-flex align-items-center">
              <Award size={12} className="me-1" />
              Why Choose CertiTrack
            </Badge>
            <h2 className="fw-bold">Powerful Features for Modern Education</h2>
            <p className="text-muted">Everything you need to manage and track student certifications in one platform.</p>
          </div>
          <div className="row g-4">
            {features.map((feature, i) => (
              <div className="col-md-6" key={i}>
                <Card className="p-4 h-100">
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">{feature.icon}</div>
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <p className="text-muted">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA */}
      {/* <section className="py-5 text-center">
        <div className="container">
          <Card className="p-5 bg-white border border-primary-subtle">
            <h2 className="fw-bold mb-3">Ready to Transform Your Institution?</h2>
            <p className="text-muted mb-4">
              Join thousands of educational institutions already using CertiTrack to streamline their certification tracking.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <Link to="/login/student" className="btn btn-primary">
                <GraduationCap size={16} className="me-2" />
                Start Tracking Now
              </Link>
              <Button variant="outline">Contact Sales</Button>
            </div>
          </Card>
        </div>
      </section> */}

      {/* Footer */}
      {/* <footer className="py-4 bg-light border-top">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <FileText size={20} className="me-2 text-primary" />
            <span className="fw-semibold">CertiTrack</span>
          </div>
          <div className="text-muted small">
            &copy; {new Date().getFullYear()} CertiTrack. All rights reserved.
          </div>
        </div>
      </footer> */}
      
          <footer className="mt-auto bg-white text-center py-3 border-top shadow-sm">
    <div class="alert alert-primary d-inline-flex align-items-center gap-4 p-3 rounded shadow-sm">
  <div class="d-flex align-items-center">
    <i class="bi bi-mortarboard-fill fs-4 me-2 text-dark"></i>
    <div><strong>{userCounts.students}</strong> Students Registered</div>
  </div>

  <div class="vr"></div>

  <div class="d-flex align-items-center">
    <i class="bi bi-person-badge-fill fs-4 me-2 text-dark"></i>
    <div><strong>{userCounts.faculty}</strong> Faculty Onboard</div>
  </div>
  
</div><br/>
<FileText size={18} className="me-2 text-primary" />
            <span className="fw-semibold">CertiTrack  </span>
             &copy;{new Date().getFullYear()} CertiTrack. All rights reserved &reg;.<br/><br/>
    <p className="text-muted small mb-0">Made with ❤️ by Dinesh</p>
  </footer>

    </div>
  );
}
