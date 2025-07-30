import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function FacultyLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [step, setStep] = useState('email'); // 'email' | 'otp' | 'newPass'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: 'faculty',
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', 'faculty');
      navigate('/dashboard/faculty');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const sendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/password/send-otp', { email: resetEmail });
      alert(res.data.message);
      setStep('otp');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/password/verify-otp', {
        email: resetEmail,
        otp,
      });
      alert(res.data.message);
      setStep('newPass');
    } catch (err) {
      alert(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handlePasswordReset = async () => {
    if (newPass !== confirmPass) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/password/reset-password', {
        email: resetEmail,
        newPassword: newPass,
      });
      alert('Password updated! You can now login.');

      // Reset all state
      setResetEmail('');
      setOtp('');
      setNewPass('');
      setConfirmPass('');
      setShowReset(false);
      setStep('email');
    } catch (err) {
      alert(err.response?.data?.message || 'Password reset failed');
    }
  };

  const handleResetCancel = () => {
    setShowReset(false);
    setStep('email');
    setResetEmail('');
    setOtp('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="container py-5">
      <div className="mx-auto card p-4 shadow" style={{ maxWidth: 400 }}>
        <h3 className="text-center mb-4">
          <i className="bi bi-person-gear"></i> Faculty Login
        </h3>

        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-3"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form-control mb-3"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <button className="btn btn-link mt-2 p-0" onClick={() => setShowReset(true)}>
          Forgot Password?
        </button>

        {showReset && (
          <div className="mt-3 p-3 border rounded bg-light">
            <h6>Reset Password</h6>

            {step === 'email' && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Your Email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <button onClick={sendOtp} className="btn btn-warning mb-2">Send OTP</button>
                <button className="btn btn-secondary w-100" onClick={handleResetCancel}>Cancel</button>
              </>
            )}

            {step === 'otp' && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button onClick={verifyOtp} className="btn btn-primary mb-2">Verify OTP</button>
                <button className="btn btn-secondary w-100" onClick={handleResetCancel}>Cancel</button>
              </>
            )}

            {step === 'newPass' && (
              <>
                <input
                  className="form-control mb-2"
                  placeholder="New Password"
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                />
                <button onClick={handlePasswordReset} className="btn btn-success">Reset Password</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
