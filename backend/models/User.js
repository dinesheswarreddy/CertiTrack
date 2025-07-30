import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  resetToken: String,
  resetTokenExpiry:Date,
  resetOtp: { type: String },
resetOtpExpires: { type: Date },
  role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
  regulation: { type: String, enum: ['R19', 'R20', 'R23', 'R26'], required: function() { return this.role === 'student'; } }

});
export default mongoose.model('User', userSchema);