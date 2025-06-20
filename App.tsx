import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Category, FinancialItem, CategoryConfig, GameLevel, GameState, FinancialItemCategoryEntry, AdminUser } from './types';
import { CATEGORIES_CONFIG, ALL_FINANCIAL_ITEMS, LEVEL_CONFIG } from './constants';
import { CheckCircleIcon, XCircleIcon, LightBulbIcon, SparklesIcon, TrophyIcon } from './components/Icons';

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface LoginScreenProps {
  onLoginSuccess: (mobileNumber: string, studentId?: string) => void;
  onNavigateToAdminLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onNavigateToAdminLogin }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState(''); 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.trim() === '' || studentId.trim() === '') {
      alert('Please enter both mobile number and student ID.');
      return;
    }
    onLoginSuccess(mobileNumber, studentId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 p-4 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-md w-full">
        <SparklesIcon className="w-16 h-16 text-sky-300 mx-auto mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Student Login</h1>
        <p className="text-slate-300 mb-8">Enter your credentials to access the game.</p>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-200 text-left mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobileNumber"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="Enter your mobile number"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-slate-200 text-left mb-1">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your Student ID"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-200 text-left mb-1">
              Password / OTP (Conceptual)
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password or OTP"
              className="w-full px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition"
            />
             <p className="text-xs text-slate-400 mt-1 text-left">For this demo, any mobile/ID will work. Password field is for illustration.</p>
          </div>
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105"
          >
            Login / Start
          </button>
        </form>
         <p className="text-xs text-slate-500 mt-6">
          Full authentication and data storage require a backend system.
        </p>
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

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onAdminLoginSuccess, onBackToStudentLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '') { // Simplified check for demo
      alert('Please enter a username.');
      return;
    }
    // In a real app, validate against a backend.
    // For this mock, we'll assume any username with "admin" in it is valid.
    if (username.toLowerCase().includes('admin')) {
        onAdminLoginSuccess({ username });
    } else {
        alert('Mock admin login: Username should contain "admin" for this demo.');
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

const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ adminUser, onAdminLogout }) => {
  // This is a conceptual dashboard. Data would be fetched from a backend.
  const mockStudentData = [
    { studentId: "S101", mobile: "98XXXXXX01", level: 1, score: 8, totalQ: 10, timeTaken: 300, startTime: "2023-10-27T10:00:00Z", endTime: "2023-10-27T10:05:00Z", feedback: "Good!" },
    { studentId: "S102", mobile: "98XXXXXX02", level: 2, score: 6, totalQ: 10, timeTaken: 450, startTime: "2023-10-27T11:00:00Z", endTime: "2023-10-27T11:07:30Z", feedback: "Challenging." },
    { studentId: "S101", mobile: "98XXXXXX01", level: 3, score: 9, totalQ: 10, timeTaken: 600, startTime: "2023-10-28T09:00:00Z", endTime: "2023-10-28T09:10:00Z", feedback: null },
  ];

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
              {mockStudentData.map((data, index) => (
                <tr key={index} className="hover:bg-slate-600/70 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{data.studentId}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{data.mobile}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{data.level}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{data.score}/{data.totalQ}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{data.timeTaken}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">{data.feedback ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button className="text-sky-400 hover:text-sky-300 underline text-xs">View Details</button>
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
    </div>
  );
};


interface LevelSelectorProps {
  onSelectLevel: (level: GameLevel) => void;
  studentIdentifier: string | null;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel, studentIdentifier }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-700 to-slate-900 p-4 text-white">
      <div className="bg-white/10 backdrop-blur-lg p-8 sm:p-12 rounded-xl shadow-2xl text-center max-w-lg w-full">
        <SparklesIcon className="w-16 h-16 text-sky-300 mx-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold mb-1">Welcome{studentIdentifier ? `, ${studentIdentifier}` : ''}!</h1>
        <p className="text-lg sm:text-xl text-slate-300 mb-8">Select your difficulty level to start the Financial Literacy Challenge.</p>
        <div className="space-y-4">
          {LEVEL_CONFIG.map(levelInfo => (
            <button
              key={levelInfo.level}
              onClick={() => onSelectLevel(levelInfo.level)}
              className={`w-full ${levelInfo.color} ${levelInfo.hoverColor} text-white font-semibold py-4 px-6 rounded-lg text-xl shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-opacity-50 ${levelInfo.borderColor.replace('border-', 'ring-')}`}
              aria-label={`Select Level ${levelInfo.level}: ${levelInfo.name}`}
            >
              Level {levelInfo.level}: {levelInfo.name}
              <span className="block text-sm font-normal opacity-80 mt-1">{levelInfo.description}</span>
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

  // Student Login
  const handleLoginSuccess = (mobileNumber: string, studentIdInput?: string) => {
    setCurrentUserMobile(mobileNumber);
    setCurrentStudentId(studentIdInput || null);
    setGameState(GameState.LevelSelection);
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

  const handleSubmitFeedback = (feedback: string) => {
    setStudentFeedbackText(feedback);
    // Conceptual: Send data to backend here
    // const sessionData = { /* ... */ };
    // console.log("Mock API Call: Sending session data with feedback", feedback, sessionData);
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
    return <LevelSelector onSelectLevel={handleSelectLevel} studentIdentifier={studentDisplayIdentifier} />;
  }
  if (gameState === GameState.StudentFeedback) {
    return <StudentFeedbackScreen 
             onSubmitFeedback={handleSubmitFeedback} 
             studentIdentifier={studentDisplayIdentifier}
             level={selectedLevel}
           />;
  }
  if (gameState === GameState.ReportPreview) {
    return (
      <ReportPreviewScreen
        studentIdentifier={studentDisplayIdentifier}
        score={score}
        totalQuestions={gameItems.length}
        selectedLevel={selectedLevel}
        studentFeedback={studentFeedbackText}
        onPlayAgain={handlePlayAgainFromReportOrGameOver} // This now goes to LevelSelection
        onBackToLevels={handlePlayAgainFromReportOrGameOver} // Consistent navigation
      />
    );
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-sky-400 to-indigo-600 p-4 text-white">
        <div className="bg-white/20 backdrop-blur-lg p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
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
      </div>
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