const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Student registration (self-service, only @micamail.in)
router.post('/register', async (req, res) => {
  const { email, password, mobile, studentId } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required.' });
  }
  if (!email.endsWith('@micamail.in')) {
    return res.status(400).json({ message: 'Only @micamail.in emails allowed.' });
  }
  const existing = await Student.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
  const student = new Student({ email, password: hashed, mobile, studentId, otp, otpExpires });
  await student.save();
  console.log(`OTP for ${email}: ${otp}`);
  res.status(201).json({ message: 'Student registered. OTP sent to email (console for now).', student: { email, mobile, studentId } });
});

// Request OTP (for login)
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email required.' });
  const student = await Student.findOne({ email });
  if (!student) return res.status(404).json({ message: 'Student not found.' });
  const otp = generateOTP();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  student.otp = otp;
  student.otpExpires = otpExpires;
  await student.save();
  console.log(`OTP for ${email}: ${otp}`);
  res.json({ message: 'OTP sent to email (console for now).' });
});

// Student login (email/password or email/otp)
router.post('/login', async (req, res) => {
  const { email, password, otp } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email required.' });
  }
  const student = await Student.findOne({ email });
  if (!student) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (password) {
    const valid = await bcrypt.compare(password, student.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ message: 'Login successful', student: { email: student.email, mobile: student.mobile, studentId: student.studentId } });
  } else if (otp) {
    if (!student.otp || !student.otpExpires || student.otpExpires < new Date()) {
      return res.status(401).json({ message: 'OTP expired or not set' });
    }
    if (student.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    // Invalidate OTP after use
    student.otp = undefined;
    student.otpExpires = undefined;
    await student.save();
    return res.json({ message: 'Login successful', student: { email: student.email, mobile: student.mobile, studentId: student.studentId } });
  } else {
    return res.status(400).json({ message: 'Password or OTP required.' });
  }
});

// Admin login (unchanged)
router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required.' });
  }
  const admin = await Admin.findOne({ username, password });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Admin login successful', admin: { username: admin.username } });
});

// Get attempted levels for a student
router.get('/attempted-levels', async (req, res) => {
  const { studentId, email } = req.query;
  let student;
  if (studentId) {
    student = await Student.findOne({ studentId });
  } else if (email) {
    student = await Student.findOne({ email });
  }
  if (!student) {
    return res.status(404).json({ attemptedLevels: [] });
  }
  res.json({ attemptedLevels: student.attemptedLevels || [] });
});

module.exports = router; 