import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import CertiTrackHome from './pages/CertiTrackHome';
import StudentLogin from './pages/StudentLogin';
import FacultyLogin from './pages/FacultyLogin';
import AdminLogin from './pages/AdminLogin';
import StudentSignUp from './pages/StudentSignUp';
import FacultySignUp from './pages/FacultySignUp';
import AdminSignup from './pages/AdminSignup';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import InternshipStats from './pages/InternshipStats';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotificationBoard from './pages/NotificationBoard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<CertiTrackHome />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/faculty" element={<FacultyLogin />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/signup/student" element={<StudentSignUp />} />
      <Route path="/signup/faculty" element={<FacultySignUp />} />
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/dashboard/faculty" element={<FacultyDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/signup/admin" element={<AdminSignup />} />
      <Route path="/stats" element={<InternshipStats />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/notification-board" element={<NotificationBoard />} />

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
