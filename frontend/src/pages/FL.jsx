import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FacultyLogin() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('faculty');
  const [password, setPassword] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: 'faculty'
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', role);
      navigate('/dashboard/faculty');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
   const handleForgotPassword = async () => {
    if (!resetEmail) {
      alert('Please enter your email');
      return;
    }
    try {
      setLoading(true);
      setMessage('');
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email: resetEmail });
      setMessage('✅ Reset email sent! Check your inbox.');
      setResetEmail('');
    } catch (err) {
      setMessage('❌ Error sending reset email: ' + (err.response?.data?.message || 'Try again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto card p-4 shadow" style={{ maxWidth: 400 }}>
        <h3 className="text-center mb-4"><i class="bi bi-person-gear"></i> Faculty Login</h3>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" placeholder="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          <input className="form-control mb-3" placeholder="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <button className="btn btn-link mt-2 p-0" onClick={() => setShowReset(!showReset)}>Forgot Password?</button>

        {showReset && (
          <div className="mt-3">
            
      {showReset && (
        <div className="mt-3 p-3 border rounded bg-light">
          <h6>Reset Password</h6>
          <input
            className="form-control mb-2"
            placeholder="Your Email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
          <button
            className="btn btn-warning w-100 mb-2"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>
          {message && <p className="text-center small">{message}</p>}
          <button
            className="btn btn-secondary w-100"
            onClick={() => setShowReset(false)}
          >
            Cancel
          </button>
        </div>
      )}          </div>
        )}
      </div>
    </div>
  );
}
