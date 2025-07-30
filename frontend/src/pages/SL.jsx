import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regulation, setRegulation] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');
const [otpSent, setOtpSent] = useState(false);
const [otpVerified, setOtpVerified] = useState(false);
const [newPass, setNewPass] = useState('');
const [confirmPass, setConfirmPass] = useState('');
const [step, setStep] = useState('email'); // 'email' | 'otp' | 'newPassword'


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role: 'student',
        regulation
      });

      localStorage.setItem('token', res.data.token);
       localStorage.setItem('role', 'student');
      navigate('/dashboard/student');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };
  const sendOtp = async () => {
const res = await axios.post('http://localhost:5000/api/password/send-otp', { email: resetEmail });

alert(res.data.message);
setOtpSent(true);
};
const verifyOtp = async () => {
const res = await axios.post('http://localhost:5000/api/password/verify-otp', { email: resetEmail, otp });
alert(res.data.message);
setOtpVerified(true);
};

  const handlePasswordReset= async () =>{
    //  if (!resetEmail) {
    //   alert('Please enter your email');
    //   return;
    // }
    // try {
    //   setShowReset(true);
    //   setMessage('');
    //   await axios.post('http://localhost:5000/api/auth/forgot-password', { email: resetEmail });
    //   setMessage('✅ Reset email sent! Check your inbox.');
    //   setResetEmail('');
    // } catch (err) {
    //   setMessage('❌ Error sending reset email: ' + (err.response?.data?.message || 'Try again'));
    // } finally {
    //   setShowReset(false);
    // }
    if (newPass !== confirmPass) return alert('Passwords do not match');
await axios.post('http://localhost:5000/api/password/reset-password', { email: resetEmail, newPassword: newPass });
alert('Password updated! You can now login.');
setOtpSent(false); setOtpVerified(false); // reset flow

  };

  return (
    <div className="container py-5">
      <div className="mx-auto card p-4 shadow" style={{ maxWidth: 400 }}>
        <h3 className="text-center mb-4">🎓 Student Login</h3>
        <form onSubmit={handleLogin}>
          <input className="form-control mb-3" placeholder="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          <input className="form-control mb-3" placeholder="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <button className="btn btn-link mt-2 p-0" onClick={() => setShowReset(true)}>Forgot Password?</button>
        <p className="mt-3 text-center">Don't have an account? <Link to="/signup/student">Sign up</Link></p>

        {showReset && (
          <div className="mt-3">
            <h6>Reset Password</h6>
            <input className="form-control mb-2" placeholder="Your Email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} />
            {/* <button className="btn btn-warning w-100 mb-2" onClick={handlePasswordReset}>Send Reset Email</button> */}
            <button onClick={sendOtp} className="btn btn-warning mb-2">Send OTP</button>
            <button className="btn btn-secondary w-100" onClick={() => setShowReset(false)}>Cancel</button>
            {otpSent && (
<>
<input className="form-control mb-2" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
<button onClick={verifyOtp} className="btn btn-primary mb-2">Verify OTP</button>
</>
)}

{otpVerified && (
<>
<input className="form-control mb-2" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} />
<input className="form-control mb-2" placeholder="Confirm Password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
<button onClick={handlePasswordReset} className="btn btn-success">Reset Password</button>
</>
)}
          </div>
        )}
      </div>
    </div>
  );
}
