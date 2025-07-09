const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDhqSbeB9jedybQxsbPrM-wnChR5XRhPWA';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'sumit.barad@micamail.in';

async function getGeminiAnalysis(prompt) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=' + GEMINI_API_KEY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis returned.';
}

function buildPrompt(session) {
  let prompt = 'Analyze the following student session for conceptual difficulties. ';
  prompt += 'List the main concepts the student struggled with, based on their incorrect answers and feedback. ';
  prompt += 'If the student got everything correct, suggest advanced topics or ways to challenge them further.\n\n';
  prompt += 'Incorrect Answers:\n';
  if (session.answers && session.answers.length > 0) {
    session.answers.forEach((ans, idx) => {
      if (!ans.isCorrect) {
        prompt += `- Q${idx + 1}: ${ans.questionText} (student answer: ${ans.selectedCategories?.join(', ')}, correct: ${ans.correctCategories?.join(', ')})\n`;
      }
    });
  } else {
    prompt += 'None\n';
  }
  prompt += '\nStudent Feedback:\n';
  prompt += session.feedbackText || 'None';
  return prompt;
}

async function generateExcelReport(session, aiAnalysis) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Session Report');
  sheet.addRow(['Student ID', session.studentId || '']);
  sheet.addRow(['Level', session.level || '']);
  sheet.addRow(['Score', session.score || '']);
  sheet.addRow(['Total Questions', session.totalQuestions || '']);
  sheet.addRow(['Start Time', session.startTime || '']);
  sheet.addRow(['End Time', session.endTime || '']);
  sheet.addRow(['Time Taken (s)', session.timeTakenSeconds || '']);
  sheet.addRow(['Student Feedback', session.feedbackText || '']);
  sheet.addRow([]);
  sheet.addRow(['AI Analysis']);
  sheet.addRow([aiAnalysis]);
  sheet.addRow([]);
  sheet.addRow(['Answers']);
  sheet.addRow(['Q#', 'Question', 'Selected', 'Correct', 'Is Correct']);
  if (session.answers && session.answers.length > 0) {
    session.answers.forEach((ans, idx) => {
      sheet.addRow([
        idx + 1,
        ans.questionText,
        Array.isArray(ans.selectedCategories) ? ans.selectedCategories.join(', ') : '',
        Array.isArray(ans.correctCategories) ? ans.correctCategories.join(', ') : '',
        ans.isCorrect ? 'Yes' : 'No',
      ]);
    });
  }
  const filePath = path.join(__dirname, `session_report_${Date.now()}.xlsx`);
  await workbook.xlsx.writeFile(filePath);
  return filePath;
}

async function sendEmailWithAttachment(to, subject, text, attachmentPath) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true', // false for STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: path.basename(attachmentPath),
        path: attachmentPath,
      },
    ],
  });
}

router.post('/analyze', async (req, res) => {
  try {
    const { session } = req.body;
    if (!session) return res.status(400).json({ message: 'Session data required.' });
    const prompt = buildPrompt(session);
    const aiAnalysis = await getGeminiAnalysis(prompt);
    const excelPath = await generateExcelReport(session, aiAnalysis);
    // Send email (if SMTP configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await sendEmailWithAttachment(
        ADMIN_EMAIL,
        'Student Session AI Analysis Report',
        'See attached Excel report for details.',
        excelPath
      );
    }
    // Clean up file after sending
    fs.unlink(excelPath, () => {});
    res.json({ analysis: aiAnalysis });
  } catch (err) {
    console.error('AI analysis error:', err);
    res.status(500).json({ message: 'AI analysis failed.' });
  }
});

module.exports = router; 