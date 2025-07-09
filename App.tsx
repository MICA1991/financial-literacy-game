import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Category, FinancialItem, CategoryConfig, GameLevel, GameState, FinancialItemCategoryEntry, AdminUser } from './types';
import { CATEGORIES_CONFIG, ALL_FINANCIAL_ITEMS, LEVEL_CONFIG } from './constants';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon, SparklesIcon, TrophyIcon } from './components/Icons';

// Add this at the top or in a new file (api.js or constants.ts)
const API_BASE_URL = 'http://localhost:5000/api';

async function studentLogin(email: string, password?: string, otp?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, otp }),
  });
  return res.json();
}

async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

async function saveSession(sessionData: any) {
  const res = await fetch(`${API_BASE_URL}/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sessionData),
  });
  return res.json();
}

async function getAllSessions(): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}/session`);
  return res.json();
}

async function getAttemptedLevels(email: string): Promise<number[]> {
  const res = await fetch(`${API_BASE_URL}/auth/attempted-levels?email=${encodeURIComponent(email)}`);
  const data = await res.json();
  return data.attemptedLevels || [];
}

async function analyzeSession(sessionData: any) {
  const res = await fetch(`${API_BASE_URL}/ai/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session: sessionData }),
  });
  return res.json();
}

// Add registration and OTP helpers
async function registerStudent(email: string, password: string, mobile?: string, studentId?: string) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, mobile, studentId }),
  });
  return res.json();
}
async function requestOtp(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/request-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return res.json();
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface LoginScreenProps {
  onLoginSuccess: (email: string, studentId?: string, mobile?: string) => void;
  onNavigateToAdminLogin: () => void;
}

// Update LoginScreen to include registration and login tabs
const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToAdminLogin }: LoginScreenProps) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);
  // Registration state
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regMessage, setRegMessage] = useState<string | null>(null);
  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginMessage(null);
    if (!email.trim() || !password.trim()) {
      setLoginMessage('Please enter your email and password.');
      return;
    }
    const result = await studentLogin(email, password);
    if (result.student) {
      onLoginSuccess(result.student.email, result.student.studentId, result.student.mobile);
    } else {
      setLoginMessage(result.message || 'Login failed');
    }
  };
  // Registration handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegMessage(null);
    if (!regEmail.trim() || !regPassword.trim()) {
      setRegMessage('Please enter your @micamail.in email and password.');
      return;
    }
    if (!regEmail.endsWith('@micamail.in')) {
      setRegMessage('Only @micamail.in emails are allowed.');
      return;
    }
    const result = await registerStudent(regEmail, regPassword, regMobile);
    setRegMessage(result.message || 'Registration complete.');
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 p-4 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-md w-full">
        <SparklesIcon className="w-16 h-16 text-sky-300 mx-auto mb-6" />
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold ${tab === 'login' ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}
            onClick={() => setTab('login')}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold ml-2 ${tab === 'register' ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'}`}
            onClick={() => setTab('register')}
          >
            Register
          </button>
        </div>
        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 text-left mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 text-left mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
            >
              Login / Start
            </button>
            {loginMessage && <p className="text-xs text-rose-300 mt-2">{loginMessage}</p>}
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="regEmail" className="block text-sm font-medium text-slate-200 text-left mb-1">
                Email (@micamail.in)
              </label>
              <input
                type="email"
                id="regEmail"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Enter your @micamail.in email"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="regPassword" className="block text-sm font-medium text-slate-200 text-left mb-1">
                Password
              </label>
              <input
                type="password"
                id="regPassword"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Set a password"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition"
                required
              />
            </div>
            <div>
              <label htmlFor="regMobile" className="block text-sm font-medium text-slate-200 text-left mb-1">
                Mobile (optional)
              </label>
              <input
                type="tel"
                id="regMobile"
                value={regMobile}
                onChange={(e) => setRegMobile(e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
            >
              Register
            </button>
            {regMessage && <p className="text-xs text-emerald-300 mt-2">{regMessage}</p>}
          </form>
        )}
        <button 
          onClick={onNavigateToAdminLogin}
          className="mt-4 text-xs text-sky-300 hover:text-sky-200 underline"
        >
          Admin Login
        </button>
      </div>
    </div>
  );
};

interface AdminLoginScreenProps {
  onAdminLoginSuccess: (adminUser: AdminUser) => void;
  onBackToStudentLogin: () => void;
}

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onAdminLoginSuccess, onBackToStudentLogin }: AdminLoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '') {
      alert('Please enter a username.');
      return;
    }
    const result = await adminLogin(username, password);
    if (result.admin) {
      onAdminLoginSuccess({ username: result.admin.username });
    } else {
      alert(result.message || 'Admin login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-700 to-neutral-900 p-4 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-md w-full">
        <SparklesIcon className="w-16 h-16 text-amber-300 mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Admin Login</h1>
        <p className="text-slate-300 mb-8">Access the administrator dashboard.</p>
        <form onSubmit={handleAdminLogin} className="space-y-6">
          <div>
            <label htmlFor="adminUsername" className="block text-sm font-medium text-slate-200 text-left mb-1">
              Username
            </label>
            <input
              type="text"
              id="adminUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username (e.g., admin)"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="adminPassword" className="block text-sm font-medium text-slate-200 text-left mb-1">
              Password
            </label>
            <input
              type="password"
              id="adminPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none transition"
              required
            />
             <p className="text-xs text-slate-400 mt-1 text-left">Password check is conceptual for this demo.</p>
          </div>
          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <button 
          onClick={onBackToStudentLogin}
          className="mt-6 text-xs text-amber-300 hover:text-amber-200 underline"
        >
          Back to Student Login
        </button>
      </div>
    </div>
  );
};


interface AdminDashboardScreenProps {
  adminUser: AdminUser | null;
  onAdminLogout: () => void;
}

// Add a simple Modal component
const Modal: React.FC<{ open: boolean; onClose: () => void; children: React.ReactNode }> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-lg w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold">&times;</button>
        {children}
      </div>
    </div>
  );
};

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ adminUser, onAdminLogout }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    getAllSessions().then((data) => setSessions(data));
  }, []);
  const handleViewDetails = (session: any) => {
    setSelectedSession(session);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSession(null);
  };

  const handleTriggerAI = async () => {
    if (!selectedSession) return;
    setAiLoading(true);
    setAiError(null);
    setAiAnalysis(null);
    try {
      const result = await analyzeSession(selectedSession);
      setAiAnalysis(result.analysis || 'No analysis returned.');
    } catch (err: any) {
      setAiError('Failed to get AI analysis.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-800 p-4 sm:p-6 text-white">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">Admin Dashboard</h1>
        <div>
          <span className="text-sm mr-4">Welcome, {adminUser?.username || 'Admin'}!</span>
          <button
            onClick={onAdminLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="bg-slate-700 p-6 rounded-xl shadow-xl mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-sky-300">Student Performance Overview (Conceptual)</h2>
        <p className="text-sm text-slate-300 mb-4">
          This is a conceptual representation. In a live application, this data would be fetched from a secure backend database
          and would include search, filtering, and pagination. Each row would allow drilling down into specific answers.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-600">
            <thead className="bg-slate-600/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Student ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Score</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Time (s)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Feedback</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-700 divide-y divide-slate-600">
              {sessions.map((session, index) => (
                <tr key={index} className="hover:bg-slate-600/70 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{session.studentId}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{session.mobile}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{session.level}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{session.score}/{session.totalQuestions}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{session.timeTakenSeconds}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{session.feedbackText ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-sky-400 hover:text-sky-300 underline text-xs" onClick={() => handleViewDetails(session)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
         <p className="text-xs text-slate-400 mt-4 text-center">Data shown is for illustrative purposes only.</p>
      </div>

      <div className="bg-slate-700 p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-3 text-amber-300">AI-Powered "Difficult Concepts" Analysis (Conceptual)</h2>
        <p className="text-sm text-slate-300 mb-2">
          The backend would enable a feature where, for a selected student or session:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-300">
          <li>Incorrect answers and student feedback are compiled.</li>
          <li>This data is sent to the Google Gemini API (e.g., <code className="bg-black/30 px-1 rounded">'gemini-2.5-flash-preview-04-17'</code>) with a prompt to analyze conceptual difficulties.</li>
          <li>The AI's textual analysis (e.g., "Student struggles with differentiating current vs. non-current liabilities, or income vs. equity recognition") is returned.</li>
          <li>This summary would be displayed here and included in detailed Excel reports sent to <code className="bg-black/30 px-1 rounded">'taral.pathak@micamail.in'</code>.</li>
        </ol>
        <button className="mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md transition disabled:opacity-50" disabled>
          Trigger AI Analysis (Backend Feature)
        </button>
      </div>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        {selectedSession ? (
          <div>
            <h2 className="text-xl font-bold mb-2">Session Details</h2>
            <pre className="bg-slate-100 text-slate-800 p-2 rounded overflow-x-auto text-xs max-h-96 mb-4">{JSON.stringify(selectedSession, null, 2)}</pre>
            <button
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md transition disabled:opacity-50 mb-2"
              onClick={handleTriggerAI}
              disabled={aiLoading}
            >
              {aiLoading ? 'Analyzing...' : 'Trigger AI Analysis'}
            </button>
            {aiError && <div className="text-red-600 text-xs mb-2">{aiError}</div>}
            {aiAnalysis && (
              <div className="bg-amber-100 text-amber-900 p-3 rounded mt-2 text-sm">
                <strong>AI Analysis:</strong>
                <div
                  className="overflow-y-auto max-h-64 whitespace-pre-line border border-amber-200 rounded p-2 mt-2 bg-white"
                  style={{ fontFamily: 'inherit' }}
                >
                  {aiAnalysis}
                </div>
                <button
                  className="mt-2 px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-xs"
                  onClick={() => {
                    navigator.clipboard.writeText(aiAnalysis);
                  }}
                >
                  Copy to Clipboard
                </button>
              </div>
            )}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};


interface LevelSelectorProps {
  onSelectLevel: (level: GameLevel) => void;
  studentIdentifier: string | null;
  attemptedLevels: number[];
  onLogout: () => void;
}

// Add a StudentLogoutButton component
const StudentLogoutButton: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <button
    onClick={onLogout}
    className="fixed top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg text-sm shadow-md z-50"
  >
    Logout
  </button>
);

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel, studentIdentifier, attemptedLevels, onLogout }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-700 to-slate-900 p-4 text-white">
      <StudentLogoutButton onLogout={onLogout} />
      <div className="bg-white/10 backdrop-blur-lg p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-lg w-full">
        <SparklesIcon className="w-16 h-16 text-sky-300 mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-1">Welcome{studentIdentifier ? `, ${studentIdentifier}` : ''}!</h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-8">Select your difficulty level to start the Financial Literacy Challenge.</p>
        {attemptedLevels.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-emerald-300 mb-2">Attempted Levels:</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {attemptedLevels.map((level) => (
                <span key={level} className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs">Level {level}</span>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-4">
          {LEVEL_CONFIG.map(levelInfo => (
            <button
              key={levelInfo.level}
              onClick={() => onSelectLevel(levelInfo.level)}
              className={`w-full ${levelInfo.color} ${levelInfo.hoverColor} text-white font-semibold py-4 px-6 rounded-lg text-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-opacity-50 ${levelInfo.borderColor.replace('border-', 'ring-')}`}
              aria-label={`Select Level ${levelInfo.level}: ${levelInfo.name}`}
              disabled={attemptedLevels.includes(levelInfo.level)}
            >
              Level {levelInfo.level}: {levelInfo.name}
              <span className="block text-sm font-normal opacity-80 mt-1">{levelInfo.description}</span>
              {attemptedLevels.includes(levelInfo.level) && (
                <span className="ml-2 text-xs text-emerald-300">(Attempted)</span>
              )}
            </button>
          ))}
        </div>
         <p className="text-xs text-slate-400 mt-10">
          Items are based on terminology from Indian corporate annual reports.
          Total items: {ALL_FINANCIAL_ITEMS.length}.
        </p>
      </div>
    </div>
  );
};


interface StudentFeedbackScreenProps {
  onSubmitFeedback: (feedback: string) => void;
  studentIdentifier: string | null;
  level: GameLevel | null;
}

const StudentFeedbackScreen: React.FC<StudentFeedbackScreenProps> = ({ onSubmitFeedback, studentIdentifier, level }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const levelInfo = level ? LEVEL_CONFIG.find(l => l.level === level) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback(feedbackText);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-teal-600 to-cyan-700 p-4 text-white">
      <StudentLogoutButton onLogout={handleStudentLogout} />
      <div className="bg-white/15 backdrop-blur-xl p-8 sm:p-10 rounded-xl shadow-2xl max-w-lg w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-center">Feedback</h1>
        <p className="text-slate-200 mb-1 text-center">Student: {studentIdentifier || "N/A"}</p>
        {levelInfo && <p className="text-slate-200 mb-6 text-center">Level: {levelInfo.level} ({levelInfo.name})</p>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-slate-100 text-left mb-2">
              How was your experience with this level? Any comments or suggestions? (Optional)
            </label>
            <textarea
              id="feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              placeholder="Enter your feedback here..."
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-500 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          >
            Submit Feedback & View Report
          </button>
        </form>
        <p className="text-xs text-slate-300 mt-6 text-center">
          Your feedback helps us improve the game!
        </p>
      </div>
    </div>
  );
};


interface ReportPreviewScreenProps {
  studentIdentifier: string | null;
  score: number;
  totalQuestions: number;
  selectedLevel: GameLevel | null;
  studentFeedback: string | null;
  onPlayAgain: () => void;
  onBackToLevels: () => void;
}

const ReportPreviewScreen: React.FC<ReportPreviewScreenProps> = ({
  studentIdentifier, score, totalQuestions, selectedLevel, studentFeedback, onPlayAgain, onBackToLevels
}) => {
  const levelInfo = selectedLevel ? LEVEL_CONFIG.find(l => l.level === selectedLevel) : null;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 p-4 text-white">
      <StudentLogoutButton onLogout={handleStudentLogout} />
      <div className="bg-white/15 backdrop-blur-xl p-8 sm:p-10 rounded-xl shadow-2xl max-w-xl w-full text-left">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Mock Performance Report</h1>
        
        <div className="mb-6 space-y-2 text-lg">
          <p><strong>Student:</strong> {studentIdentifier || "N/A"}</p>
          {levelInfo && <p><strong>Level Completed:</strong> Level {levelInfo.level} ({levelInfo.name})</p>}
          <p><strong>Score:</strong> {score} / {totalQuestions} ({percentage}%)</p>
          {studentFeedback && (
            <div className="mt-2 pt-2 border-t border-white/20">
              <strong>Your Feedback:</strong> <p className="text-sm italic opacity-90">{studentFeedback}</p>
            </div>
          )}
        </div>

        <div className="bg-white/20 p-6 rounded-lg mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-yellow-300">Admin Reporting & AI Insights (Conceptual)</h2>
          <p className="mb-2 text-sm">
            In a complete application with a backend system:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Your detailed performance (each question, your answer, correct answer, time taken, feedback) would be saved to a secure database.</li>
            <li>An Excel report would be automatically generated for the administrator (taral.pathak@micamail.in).</li>
            <li className="font-semibold">
              AI-Powered "Difficult Concepts" Summary:
              <ul className="list-disc list-inside pl-5 mt-1 space-y-1 text-xs opacity-90">
                <li>The backend would send your incorrect answers and your feedback to the Google Gemini API.</li>
                <li>Using a model like <code className="bg-black/30 px-1 rounded">'gemini-2.5-flash-preview-04-17'</code>, the API would analyze patterns in your mistakes.</li>
                <li>It would generate a summary of financial concepts you might be finding challenging.</li>
                <li>This AI-generated summary would be included in the admin's Excel report to help tailor future learning. The API key for Gemini would be securely managed on the backend.</li>
              </ul>
            </li>
            <li>The admin dashboard would show student-wise, level-wise scores, time taken, session details, and the AI concept analysis.</li>
          </ul>
        </div>
        
        <p className="text-xs text-slate-300 mb-6 text-center">
          Note: Actual report generation, emailing, AI analysis, and persistent storage require backend development. This screen is for demonstration purposes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onPlayAgain} // This should probably go to LevelSelection
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          >
            Play Another Level
          </button>
           <button
            onClick={onBackToLevels} // This is correct for going back to level selection.
            className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          >
            Back to Level Selection
          </button>
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Login);
  const [currentUserMobile, setCurrentUserMobile] = useState<string | null>(null);
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null); // For admin session

  const [selectedLevel, setSelectedLevel] = useState<GameLevel | null>(null);
  const [gameItems, setGameItems] = useState<FinancialItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [score, setScore] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [studentFeedbackText, setStudentFeedbackText] = useState<string | null>(null);

  const sessionStartTimeRef = useRef<Date | null>(null);
  const sessionEndTimeRef = useRef<Date | null>(null);
  
  const ITEMS_PER_GAME = 10;

  // In App, track attemptedLevels in state
  const [attemptedLevels, setAttemptedLevels] = useState<number[]>([]);

  // In App, add a handleStudentLogout function (move it above all usages)
  const handleStudentLogout = () => {
    setCurrentUserMobile(null);
    setCurrentStudentId(null);
    setGameState(GameState.Login);
    setAttemptedLevels([]);
  };

  // Student Login
  const handleLoginSuccess = async (email: string, studentIdInput?: string, mobile?: string) => {
    setCurrentUserMobile(mobile || null);
    setCurrentStudentId(studentIdInput || null);
    setGameState(GameState.LevelSelection);
    const levels = await getAttemptedLevels(email);
    setAttemptedLevels(levels);
  };

  // Admin Login
  const handleAdminLoginSuccess = (adminUser: AdminUser) => {
    setCurrentAdmin(adminUser);
    setGameState(GameState.AdminDashboard);
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    setGameState(GameState.Login); // Or GameState.AdminLogin if preferred
  };
  
  const navigateToAdminLogin = () => {
    setGameState(GameState.AdminLogin);
  };

  const navigateToStudentLogin = () => {
    setGameState(GameState.Login);
  }


  const loadNewGame = useCallback((level: GameLevel) => {
    const itemsForLevel = ALL_FINANCIAL_ITEMS.filter(item => item.level === level);
    const shuffledFullList = shuffleArray(itemsForLevel);
    const gameSpecificItems = shuffledFullList.slice(0, Math.min(ITEMS_PER_GAME, shuffledFullList.length));
    
    setGameItems(gameSpecificItems.length > 0 ? gameSpecificItems : shuffledFullList);
    setCurrentItemIndex(0);
    setSelectedCategories([]);
    setScore(0);
    setShowFeedback(false);
    setIsCorrect(false);
    setStudentFeedbackText(null);
    sessionStartTimeRef.current = new Date();
    sessionEndTimeRef.current = null;
    setGameState(GameState.Playing);
    setSelectedLevel(level);
  }, []);

  const handleSelectLevel = (level: GameLevel) => {
    loadNewGame(level);
  };

  const currentItem = gameItems[currentItemIndex];
  const isLevel4 = selectedLevel === 4;

  const handleCategorySelect = (category: Category) => {
    if (showFeedback) return;

    setSelectedCategories(prevSelected => {
      if (isLevel4) {
        if (prevSelected.includes(category)) {
          return prevSelected.filter(c => c !== category);
        }
        if (prevSelected.length < 2) {
          return [...prevSelected, category];
        }
        return prevSelected; 
      } else {
        return [category]; 
      }
    });
  };

  const handleSubmit = () => {
    if (!currentItem) return;
    if (isLevel4 && selectedCategories.length !== 2) return;
    if (!isLevel4 && selectedCategories.length !== 1) return;

    let correct = false;
    if (isLevel4 && currentItem.multiCategories) {
      const correctAnswers = currentItem.multiCategories.map(mc => mc.category);
      correct = selectedCategories.length === correctAnswers.length && 
                correctAnswers.every(cat => selectedCategories.includes(cat)) &&
                selectedCategories.every(cat => correctAnswers.includes(cat));
    } else if (!isLevel4 && currentItem.category) {
      correct = selectedCategories[0] === currentItem.category;
    }

    setIsCorrect(correct);
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    setShowFeedback(true);
  };

  const handleNextItem = () => {
    setShowFeedback(false);
    setSelectedCategories([]);
    if (currentItemIndex < gameItems.length - 1) {
      setCurrentItemIndex(prevIndex => prevIndex + 1);
    } else {
      sessionEndTimeRef.current = new Date();
      setGameState(GameState.GameOver);
    }
  };
  
  const handleProceedToFeedback = () => {
    setGameState(GameState.StudentFeedback);
  };

  const handleSubmitFeedback = async (feedback: string) => {
    setStudentFeedbackText(feedback);
    // Build session data
    let timeTakenSeconds = 0;
    if (sessionStartTimeRef.current) {
      const now = new Date();
      timeTakenSeconds = Math.round((now.getTime() - (sessionStartTimeRef.current as Date).getTime()) / 1000);
    }
    const sessionData = {
      studentId: currentStudentId,
      mobile: currentUserMobile,
      level: selectedLevel,
      score,
      totalQuestions: gameItems.length,
      answers: [], // TODO: fill with actual answers if available
      startTime: sessionStartTimeRef.current,
      endTime: new Date(),
      timeTakenSeconds,
      feedbackText: feedback,
    };
    await saveSession(sessionData);
    setGameState(GameState.ReportPreview);
  };
  
  const handlePlayAgainFromReportOrGameOver = () => {
    setGameState(GameState.LevelSelection); 
    setSelectedLevel(null); 
  };

  const getCategoryConfig = (categoryId: Category): CategoryConfig | undefined => {
    return CATEGORIES_CONFIG.find(c => c.id === categoryId);
  };

  // Current student display identifier
  const studentDisplayIdentifier = currentStudentId || currentUserMobile;


  // Screen Rendering Logic
  if (gameState === GameState.Login) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigateToAdminLogin={navigateToAdminLogin} />;
  }
  if (gameState === GameState.AdminLogin) {
    return <AdminLoginScreen onAdminLoginSuccess={handleAdminLoginSuccess} onBackToStudentLogin={navigateToStudentLogin} />;
  }
  if (gameState === GameState.AdminDashboard) {
    return <AdminDashboardScreen adminUser={currentAdmin} onAdminLogout={handleAdminLogout} />;
  }
  if (gameState === GameState.LevelSelection) {
    return <LevelSelector onSelectLevel={handleSelectLevel} studentIdentifier={studentDisplayIdentifier} attemptedLevels={attemptedLevels} onLogout={handleStudentLogout} />;
  }
  if (gameState === GameState.StudentFeedback) {
    return <>
      <StudentLogoutButton onLogout={handleStudentLogout} />
      <StudentFeedbackScreen 
        onSubmitFeedback={handleSubmitFeedback} 
        studentIdentifier={studentDisplayIdentifier}
        level={selectedLevel}
      />
    </>;
  }
  if (gameState === GameState.ReportPreview) {
    return <>
      <StudentLogoutButton onLogout={handleStudentLogout} />
      <ReportPreviewScreen
        studentIdentifier={studentDisplayIdentifier}
        score={score}
        totalQuestions={gameItems.length}
        selectedLevel={selectedLevel}
        studentFeedback={studentFeedbackText}
        onPlayAgain={handlePlayAgainFromReportOrGameOver} // This now goes to LevelSelection
        onBackToLevels={handlePlayAgainFromReportOrGameOver} // Consistent navigation
      />
    </>;
  }
  if (gameState === GameState.GameOver) {
    const totalQuestions = gameItems.length;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    let message = "Good effort! Keep practicing to improve your financial literacy!";
    if (percentage === 100) message = "Perfect Score! You're a financial statement maestro!";
    else if (percentage >= 80) message = "Excellent! You're a financial whiz!";
    else if (percentage >= 60) message = "Great job! You have a solid understanding.";
    
    const levelInfo = selectedLevel ? LEVEL_CONFIG.find(l => l.level === selectedLevel) : null;

    return (
      <>
        <StudentLogoutButton onLogout={handleStudentLogout} />
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-indigo-600 p-4 text-white">
          <TrophyIcon className="w-24 h-24 text-yellow-300 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-2">Game Over!</h1>
          {levelInfo && <p className="text-lg mb-4">(Level {levelInfo.level}: {levelInfo.name})</p>}
          <p className="text-2xl mb-2">Your Final Score: {score} / {totalQuestions}</p>
          <p className="text-xl mb-6">({percentage}%)</p>
          <p className="text-lg mb-8">{message}</p>
          <div className="space-y-4">
            <button
              onClick={handleProceedToFeedback}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-800 font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
            >
              Provide Feedback & View Report
            </button>
            <button
              onClick={handlePlayAgainFromReportOrGameOver}
              className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
            >
              Skip Feedback & Play Another Level
            </button>
          </div>
        </div>
      </>
    );
  }

  if (gameState === GameState.Playing) {
    if (!currentItem) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 text-slate-700">
          Loading level or no items found...
        </div>
      );
    }
    
    const levelInfo = selectedLevel ? LEVEL_CONFIG.find(l => l.level === selectedLevel) : null;
    const questionNumber = currentItemIndex + 1;
    const totalQuestionsInGame = gameItems.length;
    const studentDisplayId = studentDisplayIdentifier || "Guest";

    let feedbackMessage = "";
    if (showFeedback) {
      if (isCorrect) {
        feedbackMessage = "Correct!";
      } else {
        if (isLevel4 && currentItem.multiCategories) {
          const correctLabels = currentItem.multiCategories
            .map(mc => getCategoryConfig(mc.category)?.label)
            .filter(Boolean)
            .join(' and ');
          feedbackMessage = `Not quite! The correct answers are ${correctLabels}.`;
        } else if (!isLevel4 && currentItem.category) {
          const correctLabel = getCategoryConfig(currentItem.category)?.label;
          feedbackMessage = `Not quite! The correct answer is ${correctLabel}.`;
        }
      }
    }

    return (
      <>
        <StudentLogoutButton onLogout={handleStudentLogout} />
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 selection:bg-sky-200 selection:text-sky-900">
          <header className="w-full max-w-2xl mb-6 text-center">
            <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                <span>Student: {studentDisplayId}</span>
                <span>Level: {levelInfo?.level} ({levelInfo?.name})</span>
              </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 flex items-center justify-center">
              <SparklesIcon className="w-9 h-9 sm:w-10 sm:h-10 mr-3 text-sky-500" />
              Financial Literacy Challenge
            </h1>
          </header>

          <main className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="mb-6 pb-4 border-b border-slate-200">
              <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
                <span>Question: {questionNumber} / {totalQuestionsInGame}</span>
                <span>Score: {score}</span>
              </div>
              <div className="bg-slate-100 p-4 rounded-lg min-h-[80px] flex flex-col items-center justify-center">
                <p className="text-xl sm:text-2xl font-semibold text-slate-700 text-center" aria-live="polite">
                  {currentItem.name}
                </p>
                {isLevel4 && <p className="text-sm text-sky-600 mt-1 font-medium"> (Select two categories)</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" role="group" aria-label="Categories">
              {CATEGORIES_CONFIG.map((catConfig) => {
                const isSelected = selectedCategories.includes(catConfig.id);
                let buttonStyle = "";

                if (showFeedback) {
                  let isActualCorrectCategory = false;
                  if (isLevel4 && currentItem.multiCategories) {
                    isActualCorrectCategory = currentItem.multiCategories.some(mc => mc.category === catConfig.id);
                  } else if (!isLevel4 && currentItem.category) {
                    isActualCorrectCategory = currentItem.category === catConfig.id;
                  }

                  if (isActualCorrectCategory) { 
                    buttonStyle = `ring-4 ring-offset-2 ${catConfig.borderColor} ${catConfig.color}`;
                  } else if (isSelected && !isActualCorrectCategory) { 
                    buttonStyle = `ring-4 ring-offset-2 ring-red-500 ${catConfig.color} opacity-70`;
                  } else { 
                    buttonStyle = 'opacity-60';
                  }
                } else { 
                  buttonStyle = `${catConfig.hoverColor} transform hover:scale-105 focus:ring-4 focus:ring-opacity-50`;
                  if (isSelected) {
                    buttonStyle += ` ring-4 ring-offset-2 ${catConfig.borderColor} ring-opacity-75`;
                  }
                }

                return (
                  <button
                    key={catConfig.id}
                    onClick={() => handleCategorySelect(catConfig.id)}
                    disabled={showFeedback || (isLevel4 && selectedCategories.length >= 2 && !isSelected)}
                    aria-pressed={isSelected}
                    className={`
                      p-4 rounded-lg text-white font-medium text-left transition-all duration-150 ease-in-out
                      ${catConfig.color} ${buttonStyle}
                      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                    `}
                  >
                    <span className="text-lg">{catConfig.label}</span>
                  </button>
                );
              })}
            </div>

            {!showFeedback && (
              <button
                onClick={handleSubmit}
                disabled={
                  (isLevel4 && selectedCategories.length !== 2) ||
                  (!isLevel4 && selectedCategories.length !== 1)
                }
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 focus:ring-4 focus:ring-sky-300"
              >
                Submit Answer
              </button>
            )}

            {showFeedback && (
              <div className={`mt-6 p-4 rounded-lg bg-opacity-80
                ${isCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-300' : 'bg-rose-50 text-rose-700 border border-rose-300'}`}
                role="alert"
              >
                <div className="flex items-center mb-2">
                  {isCorrect ? (
                    <CheckCircleIcon className="w-7 h-7 mr-2 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <XCircleIcon className="w-7 h-7 mr-2 text-rose-500 flex-shrink-0" />
                  )}
                  <h3 className="text-xl font-semibold">
                    {feedbackMessage}
                  </h3>
                </div>
                <div className="flex items-start text-sm mt-1">
                  <LightBulbIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                  <p>{currentItem.explanation}</p>
                </div>
                <button
                  onClick={handleNextItem}
                  className={`w-full mt-4 font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:ring-4
                  ${isCorrect ? 'bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-300' : 'bg-rose-500 hover:bg-rose-600 text-white focus:ring-rose-300'}
                  `}
                >
                  {currentItemIndex < gameItems.length - 1 ? 'Next Question' : 'Show Results'}
                </button>
              </div>
            )}
          </main>
          <footer className="mt-8 text-center text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} Financial Literacy Game. Focused on Indian Annual Reports.</p>
            <p>Displaying {totalQuestionsInGame > 0 ? totalQuestionsInGame : ITEMS_PER_GAME} questions per game session.</p>
          </footer>
        </div>
      </>
    );
  }
  
  // Fallback for any unhandled game state
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      Error: Unknown game state or not playing. Current state: {gameState}
       <button onClick={() => setGameState(GameState.Login)} className="ml-4 p-2 bg-sky-500 rounded">Go to Login</button>
    </div>
  );
};

export default App;