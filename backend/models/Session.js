const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  mobile: { type: String },
  level: { type: Number },
  score: { type: Number },
  totalQuestions: { type: Number },
  answers: { type: Array },
  startTime: { type: Date },
  endTime: { type: Date },
  timeTakenSeconds: { type: Number },
  feedbackText: { type: String }
});

module.exports = mongoose.model('Session', sessionSchema); 