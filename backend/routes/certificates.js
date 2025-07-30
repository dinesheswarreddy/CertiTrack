import express from 'express';
import Certificate from '../models/Certificate.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Create Certificate
router.post('/', protect, async (req, res) => {
  try {
    const cert = new Certificate({
      ...req.body,
      student: req.user.id // Add student ID from token
    });
    const saved = await cert.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving certificate:', err);
    res.status(500).json({ message: 'Failed to save certificate' });
  }
});

// ✅ Get all certificates (Admin with filters)
router.get('/', protect, async (req, res) => {
  try {
    const { regulation, academicYear, yearOfStudy, semester, company, cohort } = req.query;

    const filter = {};
    if (regulation) filter.regulation = regulation;
    if (academicYear) filter.academicYear = academicYear;
    if (yearOfStudy) filter.yearOfStudy = yearOfStudy;
    if (semester) filter.semester = semester;
    if (company) filter.companyName = company;
    if (cohort) filter.cohort = cohort;

    const data = await Certificate.find(filter).populate('student', 'name email');
    res.json(data);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ message: 'Failed to fetch certificates' });
  }
});

// ✅ Get certificates of logged-in student
router.get('/mine', protect, async (req, res) => {
  try {
    const data = await Certificate.find({ student: req.user.id });
    res.json(data);
  } catch (err) {
    console.error('Error fetching student certificates:', err);
    res.status(500).json({ message: 'Failed to fetch student certificates' });
  }
});

// ✅ Update certificate
router.put('/:id', protect, async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json(cert);
  } catch (err) {
    console.error('Error updating certificate:', err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// ✅ Delete certificate
router.delete('/:id', protect, async (req, res) => {
  try {
    const cert = await Certificate.findByIdAndDelete(req.params.id);
    if (!cert) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting certificate:', err);
    res.status(500).json({ message: 'Delete failed' });
  }
});

export default router;
