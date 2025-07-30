import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Utility: Generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Configure transporter for nodemailer
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}
});

// @desc Send OTP to email
// @route POST /api/password/send-otp
export const sendOtp = async (req, res) => {
const { email } = req.body;

try {
const user = await User.findOne({ email });
if (!user) return res.status(404).json({ message: 'User not found' });
const otp = generateOtp();
const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

// Save OTP and expiry in user document
user.resetOtp = otp;
user.resetOtpExpires = otpExpires;
await user.save();

// Send Email
await transporter.sendMail({
  from: `"SkillPost" <${process.env.EMAIL_USER}>`,
  to: email,
  subject: 'Your OTP for Password Reset',
  text: `Your OTP is: ${otp}. It is valid for 10 minutes.`
});

res.json({ message: 'OTP sent to email' });
} catch (err) {
console.error('Send OTP error:', err);
res.status(500).json({ message: 'Failed to send OTP' });
}
};
// @desc Verify OTP and reset password
// @route POST /api/password/verify-otp
export const verifyOtpAndResetPassword = async (req, res) => {
const { email, otp, newPassword } = req.body;

try {
const user = await User.findOne({ email });
if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
return res.status(400).json({ message: 'Invalid or expired OTP' });
}
// Hash and save new password
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(newPassword, salt);

// Clear OTP
user.resetOtp = undefined;
user.resetOtpExpires = undefined;

await user.save();
res.json({ message: 'Password reset successfully' });
} catch (err) {
console.error('Reset password error:', err);
res.status(500).json({ message: 'Failed to reset password' });
}
};
