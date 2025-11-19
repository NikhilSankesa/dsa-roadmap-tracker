// src/App.jsx
import { useState, useEffect } from 'react';
import { Trophy, LogOut, Lock } from 'lucide-react';
import { roadmapData } from './data/roadmapData';
import { useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';
import { useToast } from './hooks/useToast';
import { calculateStats, getActivityData } from './utils/calculations';
import { AuthModal } from './components/Auth/AuthModal';
import { StatsDashboard } from './components/Dashboard/StatsDashboard';
import { ActivityHeatmap } from './components/Dashboard/ActivityHeatmap';
import { ToastContainer } from './components/Toast/Toast';
import { WeekCard } from './components/Roadmap/WeekCard';

// ========== LOCK CONFIGURATION ==========
// Set to true to lock weeks 3+ for non-authenticated users
// Set to false to unlock all weeks for everyone
const ENABLE_WEEK_LOCKING = true;
const UNLOCKED_WEEKS_COUNT = 2;
// =========================================

function App() {
  
  const { currentUser, isAuthenticated, isLoading: authLoading, login, signup, logout } = useAuth();
  const { userProgress, isLoading: progressLoading, toggleTask, updateNote, toggleSkipDay } = useProgress(currentUser);
  const { toasts, removeToast, success, error, warning, auth } = useToast();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [expandedDays, setExpandedDays] = useState({});

  
  const isLoading = authLoading || (isAuthenticated && progressLoading);

  
  const shouldShowLoadingScreen = isLoading && !showAuthModal;

  // Check roadmapData exists
  const hasRoadmapData = roadmapData && Array.isArray(roadmapData.weeks) && roadmapData.weeks.length > 0;

  // Calculate stats from roadmapData and userProgress
  const stats = calculateStats(roadmapData, userProgress);
  const activityData = getActivityData(userProgress.completedTasks);

  // Calculate total counts for StatsDashboard
  const totalDays = hasRoadmapData 
    ? roadmapData.weeks.reduce((sum, week) => sum + week.days.length, 0) 
    : 0;
  
  const totalTasks = hasRoadmapData
    ? roadmapData.weeks.reduce((sum, week) => 
        sum + week.days.reduce((daySum, day) => daySum + day.tasks.length, 0), 0
      )
    : 0;

  // Auto-expand first incomplete week on load
  useEffect(() => {
    if (hasRoadmapData && isAuthenticated && userProgress.completedTasks) {
      const firstIncompleteWeek = roadmapData.weeks.find(week => {
        const weekTotalTasks = week.days.reduce((sum, day) => sum + day.tasks.length, 0);
        const weekCompletedTasks = week.days.reduce(
          (sum, day) => sum + day.tasks.filter(task => userProgress.completedTasks[task.id]).length,
          0
        );
        return weekCompletedTasks < weekTotalTasks;
      });

      if (firstIncompleteWeek) {
        setExpandedWeeks(prev => ({
          ...prev,
          [firstIncompleteWeek.weekNumber]: true
        }));
      }
    }
  }, [isAuthenticated, hasRoadmapData]);

  // ==================== EVENT HANDLERS ====================

  const handleLogin = async (email, password) => {
    
    try {
      await login(email, password);
      // Only close modal if login succeeds
      setShowAuthModal(false);
    } catch (error) {
      // Re-throw to let AuthModal catch it
      throw error;
    }
  };

  const handleSignup = async (username, email, password) => {
    
    try {
      await signup(username, email, password);
      // Don't close modal - let AuthModal show success message
    } catch (error) {
      // Re-throw to let AuthModal catch it
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleTask = (taskId) => {
    if (!isAuthenticated) {
      auth('Please login to track your progress and save data', 4000);
      setTimeout(() => setShowAuthModal(true), 500);
      return;
    }
    
    try {
      toggleTask(taskId);
    } catch (error) {
      error(error.message || 'Failed to update task', 4000);
    }
  };

  const handleUpdateNote = (dayId, note) => {
    if (!isAuthenticated) {
      auth('🔐 Please login to save notes and track your learning!', 4000);
      setTimeout(() => setShowAuthModal(true), 500);
      return;
    }
    
    try {
      updateNote(dayId, note);
    } catch (error) {
      error(error.message || 'Failed to save note', 4000);
    }
  };

  const handleToggleSkipDay = (dayId) => {
    if (!isAuthenticated) {
      auth('🔐 Please login to skip days and manage your schedule!', 4000);
      setTimeout(() => setShowAuthModal(true), 500);
      return;
    }
    
    try {
      toggleSkipDay(dayId);
    } catch (error) {
      error(error.message || 'Failed to skip day', 4000);
    }
  };

  // Handler when authentication is required
  const handleAuthRequired = () => {
    auth('🔐 Please login to track your progress and save your work!', 4000);
    setTimeout(() => setShowAuthModal(true), 500);
  };

  // Toggle week expansion
  const toggleWeek = (weekNumber) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  // Toggle day expansion (used by WeekCard)
  const handleToggleDayExpand = (dayId) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  // ==================== RENDER ====================

  if (shouldShowLoadingScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 flex-shrink-0" />
                <span>DSA Mastery Roadmap</span>
              </h1>
              <p className="text-indigo-100 mt-1 text-xs sm:text-sm lg:text-base">110-Day Journey • Track Your Progress</p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              {isAuthenticated && (
                <div className="text-left sm:text-right">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold">{stats.completionPercentage}%</div>
                  <div className="text-xs sm:text-sm text-indigo-100">Complete</div>
                </div>
              )}
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-indigo-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium text-sm sm:text-base whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Login / Sign Up</span>
                  <span className="sm:hidden">Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {hasRoadmapData ? (
          <>
            {/* Stats Dashboard */}
            {isAuthenticated ? (
              <div className="mb-8 space-y-6">
                <StatsDashboard 
                  stats={{
                    ...stats,
                    totalDays,
                    totalTasks
                  }}
                />
                <ActivityHeatmap activityData={activityData} />
              </div>
            ) : (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="w-full sm:w-auto">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-900 mb-2">
                      🚀 Start Your DSA Journey Today!
                    </h2>
                    <p className="text-sm sm:text-base text-yellow-800">
                      Track your progress, save notes, and maintain your learning streak!
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-yellow-700 transition-colors font-medium whitespace-nowrap text-sm sm:text-base w-full sm:w-auto"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}

            {/* Roadmap Weeks - Using WeekCard Component */}
            <div className="space-y-4">
              {roadmapData.weeks.map((week) => {
                const isLocked = ENABLE_WEEK_LOCKING && !isAuthenticated && week.weekNumber > UNLOCKED_WEEKS_COUNT;
                
                return (
                  <div
                    key={week.weekNumber}
                    className={`transform transition-all duration-300 ${
                      isLocked 
                        ? 'hover:scale-[1.01] hover:-translate-y-1' 
                        : 'hover:scale-[1.005]'
                    }`}
                    title={isLocked ? `🔒 Sign in to unlock Week ${week.weekNumber}` : ''}
                  >
                  <WeekCard
                    // key={week.weekNumber}
                    week={week}
                    isExpanded={expandedWeeks[week.weekNumber]}
                    onToggleExpand={() => {
                      if (isLocked) {
                        const messages = [
                          `🔒 Want to explore ${week.title}? Sign up for free to unlock all weeks!`,
                          `🚀 Week ${week.weekNumber} awaits! Create your free account to continue learning.`,
                          `💡 Unlock Week ${week.weekNumber} and ${roadmapData.weeks.length - week.weekNumber} more weeks with a free account!`,
                        ];
                        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                        auth(randomMessage, 5000);
                        setTimeout(() => setShowAuthModal(true), 800);
                      } else {
                        toggleWeek(week.weekNumber);
                      }
                    }}
                    expandedDays={expandedDays}
                    onToggleDayExpand={handleToggleDayExpand}
                    userProgress={userProgress}
                    onToggleTask={handleToggleTask}
                    onUpdateNote={handleUpdateNote}
                    onToggleSkipDay={handleToggleSkipDay}
                    isAuthenticated={isAuthenticated}
                    isLocked={isLocked}
                    onAuthRequired={handleAuthRequired}
                  /></div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-red-600 text-lg font-semibold">Error: Unable to load roadmap data</div>
            <div className="text-gray-600 mt-2">Please check the roadmapData.js file</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;