import express from 'express';
import crypto from "crypto";
import User from "../models/User.js";
// import sendEmail from "../utils/sendEmail.js"; // We'll create this
import bcrypt from "bcryptjs";
import { login, register,getProfile} from '../controllers/authController.js';
import OtpToken from '../models/OtpToken.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/register', register);
router.post('/login', login);

router.get('/profile', protect, getProfile);

// router.post("/forgot-password", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min expiry

//     user.resetToken = resetToken;
//     user.resetTokenExpiry = resetTokenExpiry;
//     await user.save();

//     const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
//     const message = `
//       <h2>Password Reset Request</h2>
//       <p>Click the link below to reset your password:</p>
//       <a href="${resetUrl}">${resetUrl}</a>
//     `;

//     await sendEmail(user.email, "Password Reset", message);
//     res.json({ message: "Reset link sent to your email" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ✅ Reset Password
// router.post("/reset-password/:token", async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const user = await User.findOne({
//       resetToken: token,
//       resetTokenExpiry: { $gt: Date.now() }
//     });

//     if (!user) return res.status(400).json({ message: "Invalid or expired token" });

//     const hashed = await bcrypt.hash(password, 10);
//     user.password = hashed;
//     user.resetToken = undefined;
//     user.resetTokenExpiry = undefined;

//     await user.save();
//     res.json({ message: "Password updated successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.post('/send-otp', async (req, res) => {
const { email } = req.body;
const otp = Math.floor(100000 + Math.random() * 900000).toString();

try {
const user = await User.findOne({ email });
if (!user) return res.status(404).json({ message: 'Email not found' });
await OtpToken.findOneAndDelete({ email });

await OtpToken.create({
  email,
  otp,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 mins
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Your OTP for Password Reset',
  html: `<p>Your OTP is <b>${otp}</b>. It will expire in 5 minutes.</p>`
};

await transporter.sendMail(mailOptions);
res.json({ message: 'OTP sent' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Failed to send OTP' });
}
});
// Verify OTP
router.post('/verify-otp', async (req, res) => {
const { email, otp } = req.body;

const token = await OtpToken.findOne({ email, otp });
if (!token || token.expiresAt < Date.now()) {
return res.status(400).json({ message: 'Invalid or expired OTP' });
}

res.json({ message: 'OTP verified' });
});

// Update Password
router.post('/reset-password', async (req, res) => {
const { email, newPassword } = req.body;
try {
const hashed = await bcrypt.hash(newPassword, 10);
await User.findOneAndUpdate({ email }, { password: hashed });
await OtpToken.deleteOne({ email });
res.json({ message: 'Password updated successfully' });
} catch (err) {
res.status(500).json({ message: 'Failed to update password' });
}
});
export default router;