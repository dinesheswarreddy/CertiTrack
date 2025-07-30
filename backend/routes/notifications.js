import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Get all notifications (for students & admin)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
});

// ✅ Post new notification (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }
    const notification = new Notification({ title, message });
    const saved = await notification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to post notification' });
  }
});

// ✅ Delete notification (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete notification' });
  }
});

export default router;
