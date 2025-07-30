import express from 'express';
import User from '../models/User.js'; // assuming model is named User
const router = express.Router();

// GET: /api/users/role-count
router.get('/role-count', async (req, res) => {
try {
const students = await User.countDocuments({ role: 'student' });
const faculty = await User.countDocuments({ role: 'faculty' });
res.json({ students, faculty });
} catch (error) {
console.error('Error fetching role count:', error);
res.status(500).json({ message: 'Error fetching role count' });
}
});

export default router;