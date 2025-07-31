import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = process.env.REACT_APP_BACKEND_API;


export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email !== 'iamadmin@vishnu.edu.in' || password !== '@123456') {
      alert('Invalid Admin Credentials');
      return;
    }

    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
        role: 'admin'
      });

      localStorage.setItem('token', res.data.token);
      navigate('/dashboard/admin');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto card p-4 shadow" style={{ maxWidth: 400 }}>
        <h3 className="text-center mb-4"><i className="bi bi-shield-lock-fill fs-3 text-primary"/>Admin Login</h3>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" placeholder="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          <input className="form-control mb-3" placeholder="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}
