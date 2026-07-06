import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Alert } from "react-bootstrap";
const API = process.env.REACT_APP_BACKEND_API;


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setMessage("");
    }
  };

  return (
    <div className="ct-auth-wrap">
      <div className="ct-auth-card" style={{ maxWidth: 400 }}>
      <div className="ct-auth-header">
        <span className="ct-seal ct-seal-lg"><i className="bi bi-key-fill" /></span>
        <h3>Forgot Password</h3>
        <p>We'll send you a reset link</p>
      </div>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className="w-100">
          Send Reset Link
        </Button>
      </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;