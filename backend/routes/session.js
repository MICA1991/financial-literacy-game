const express = require('express');
const router = express.Router();
const Session = require('../models/Session');
const Student = require('../models/Student');

// Save a game session
router.post('/', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    // Update student's attemptedLevels
    if (req.body.studentId && req.body.level) {
      await Student.findOneAndUpdate(
        { studentId: req.body.studentId },
        { $addToSet: { attemptedLevels: req.body.level } }
      );
    }
    res.status(201).json({ message: 'Session saved', session });
  } catch (err) {
    res.status(400).json({ message: 'Error saving session', error: err.message });
  }
});

// Get all sessions (admin)
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sessions', error: err.message });
  }
});

module.exports = router; 