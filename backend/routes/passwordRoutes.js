import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import OtpToken from '../models/OtpToken.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js'; // ✅ import the utility

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🔹 Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await OtpToken.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );

  // ✅ Use utility to send email
  await sendEmail(
    email,
    'Your OTP for Password Reset in CertiTrack',
    `Your OTP is: <b>${otp}</b>. It is valid for 5 minutes.`
  );

  res.json({ message: 'OTP sent to your email' });
});

// 🔹 Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const record = await OtpToken.findOne({ email });
  if (!record) return res.status(400).json({ message: 'No OTP found' });

  if (record.otp !== otp)
    return res.status(400).json({ message: 'Invalid OTP' });

  if (record.expiresAt < new Date())
    return res.status(400).json({ message: 'OTP expired' });

  res.json({ message: 'OTP verified' });
});

// 🔹 Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate({ email }, { password: hashedPassword });
  await OtpToken.deleteOne({ email }); // clean up OTP after use

  res.json({ message: 'Password has been reset successfully' });
});

export default router;
