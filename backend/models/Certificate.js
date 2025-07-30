import mongoose from 'mongoose';

const certSchema = new mongoose.Schema({
  regulation: { type: String, enum: ['R19', 'R20', 'R23', 'R26'], required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Linked to User
  studentId: { type: String, required: true },

  // ✅ New field: regulation (auto-filled from user)
  regulation: { type: String, enum: ['R19', 'R20', 'R23', 'R26'], required: true },

  // ✅ New field: Academic Year (e.g., 2023-24)
  academicYear: { type: String, required: true },

  // ✅ Existing field (Year of Study: 1, 2, 3, 4)
  yearOfStudy: { type: String, required: true },

  // ✅ New field: Semester (1-8)
  semester: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8], required: true },

  internshipTitle: { type: String, required: true },
  companyName: { type: String, required: true },
  internshipType: { type: String, required: true },
  internshipPaid: { type: Boolean, default: false },
  stipendAmount: { type: Number },

  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  certificateURL: { type: String, required: true },

  cohort: {
    type: String,
    enum: [
      'cohort-7', 'cohort-8', 'cohort-9', 'cohort-10',
      'cohort-11', 'cohort-12', 'cohort-13', 'cohort-14', 'cohort-15'
    ],
    required: function () { return this.companyName === 'AICTE'; }
  },

  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Certificate', certSchema);
