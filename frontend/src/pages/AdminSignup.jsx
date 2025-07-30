import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        ...formData,
        role: 'admin'
      });
      alert('Admin registered successfully!');
      navigate('/admin/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto card p-4 shadow" style={{ maxWidth: 400 }}>
        <h3 className="text-center mb-4">🛡️ Admin Signup</h3>
        <form onSubmit={handleSignup}>
          <input
            className="form-control mb-3"
            placeholder="Full Name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            placeholder="Email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            placeholder="Password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" className="btn btn-success w-100">Signup</button>
        </form>
      </div>
    </div>
  );
}
