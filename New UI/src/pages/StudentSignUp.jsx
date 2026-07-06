import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_BACKEND_API;


export default function StudentSignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regulation, setRegulation] = useState(''); // ✅ Added state for regulation
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!regulation) {
      alert('Please select a regulation');
      return;
    }

    try {
      await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
        role: 'student',
        regulation // ✅ Added regulation to API request
      });

      alert('Registered successfully. You can now log in.');
      navigate('/login/student');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="ct-auth-wrap">
      <div className="ct-auth-card">
        <div className="ct-auth-header">
          <span className="ct-seal ct-seal-lg"><i className="bi bi-mortarboard-fill" /></span>
          <h3>Student Sign Up</h3>
          <p>Create your student account</p>
        </div>
        <form onSubmit={handleRegister}>
          <input
            className="form-control mb-3"
            placeholder="Full Name"
            required
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            className="form-control mb-3"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="form-control mb-3"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {/* ✅ Regulation Dropdown */}
          <select
            className="form-select mb-3"
            value={regulation}
            onChange={e => setRegulation(e.target.value)}
            required
          >
            <option value="">Select Regulation</option>
            <option value="R19">R19</option>
            <option value="R20">R20</option>
            <option value="R23">R23</option>
            <option value="R26">R26</option>
          </select>

          <button type="submit" className="btn btn-success w-100">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}