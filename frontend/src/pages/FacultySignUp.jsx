import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'react-bootstrap'; 
const API = process.env.REACT_APP_BACKEND_API;



export default function FacultySignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        name,
        email,
        password,
        role: 'faculty'
      });

      alert('Faculty account created. You can now log in.');
      navigate('/login/faculty');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container py-5">
      <Button className="mb-3" variant="secondary" onClick={() => navigate('/dashboard/admin')}>
        ← Back to Dashboard
      </Button>
      <div className="mx-auto card p-4 shadow" style={{ maxWidth: 400 }}>
        <h3 className="text-center mb-4"><i class="bi bi-person-gear"></i> Faculty Sign Up</h3>
        <form onSubmit={handleRegister}>
          <input
            className="form-control mb-3"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="form-control mb-3"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
