// src/App.jsx
import React, { useState } from 'react';
import { Trophy, Star, User, LogIn, LogOut, ChevronDown, ChevronRight, Calendar, BookOpen, CheckCircle2, Circle, Clock, ExternalLink, StickyNote } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';
import { calculateStats, getActivityData, getMotivationMessage } from './utils/calculations';
import { AuthModal } from './components/Auth/AuthModal';
import { StatsDashboard } from './components/Dashboard/StatsDashboard';
import { ActivityHeatmap } from './components/Dashboard/ActivityHeatmap';
import { roadmapData } from './data/roadmapData';

function App() {
  const { currentUser, userProfile, isAuthenticated, login, signup, logout } = useAuth();
  const { userProgress, toggleTask, updateNote, toggleSkipDay } = useProgress(currentUser);
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState({ 1: true });
  const [expandedDays, setExpandedDays] = useState({});

  // Calculate stats
  const stats = calculateStats(roadmapData, userProgress);
  const activityData = getActivityData(userProgress.completedTasks);
  const motivationMessage = getMotivationMessage(stats);

  // Auth handlers with error handling
  const handleLogin = async (email, password) => {
    try {
      await login(email, password);
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (username, password) => {
    try {
      signup(username, password);
    } catch (error) {
      throw error;
    }
  };

  // Task handlers with authentication check
  const handleToggleTask = (taskId) => {
    if (!isAuthenticated) {
      alert('Please login to track progress');
      setShowAuthModal(true);
      return;
    }
    
    try {
      toggleTask(taskId);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdateNote = (dayId, note) => {
    if (!isAuthenticated) {
      alert('Please login to save notes');
      return;
    }
    
    try {
      updateNote(dayId, note);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleToggleSkipDay = (dayId) => {
    if (!isAuthenticated) {
      alert('Please login to skip days');
      return;
    }
    
    try {
      toggleSkipDay(dayId);
    } catch (error) {
      alert(error.message);
    }
  };

  // Toggle week expansion
  const toggleWeek = (weekNumber) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekNumber]: !prev[weekNumber]
    }));
  };

  // Toggle day expansion
  const toggleDay = (weekNumber, dayNumber) => {
    const key = `${weekNumber}-${dayNumber}`;
    setExpandedDays(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Check if task is completed
  const isTaskCompleted = (taskId) => {
    // return !!userProgress.completedTasks[taskId];
    return !!userProgress.completedTasks[taskId];
  };

  // Get day note
  const getDayNote = (dayId) => {
    return userProgress.notes[dayId] || '';
  };

  // Check if day is skipped
  const isDaySkipped = (dayId) => {
    // return userProgress.skippedDays.includes(dayId);
    return !!userProgress.skippedDays[dayId];
  };

  // Check if we have valid roadmap data
  const hasRoadmapData = roadmapData && Array.isArray(roadmapData.weeks) && roadmapData.weeks.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="w-8 h-8" />
                DSA Mastery Roadmap
              </h1>
              <p className="text-indigo-100 mt-1">110-Day Journey • Track Your Progress</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-4xl font-bold">{stats.completionPercentage}%</div>
                <div className="text-sm text-indigo-100">Complete</div>
              </div>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <div className="bg-white bg-opacity-20 px-3 py-2 rounded-lg flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {userProfile?.username || currentUser?.email}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {hasRoadmapData ? (
          <>
            {/* Stats Dashboard */}
            <StatsDashboard stats={stats} />

            {/* Activity Heatmap */}
            {isAuthenticated && <ActivityHeatmap activityData={activityData} />}

            {/* Motivation Banner */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 animate-pulse" />
                <div className="text-lg font-semibold">{motivationMessage}</div>
              </div>
            </div>

            {/* Login Prompt for non-authenticated users */}
            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-6 h-6 text-yellow-600" />
                  <div className="flex-1">
                    <div className="font-semibold text-yellow-900">Login to Track Your Progress</div>
                    <div className="text-sm text-yellow-700 mt-1">
                      Create an account to save progress, maintain streaks, and track your learning journey!
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors whitespace-nowrap"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}

            {/* Roadmap Content */}
            <div className="space-y-6">
              {roadmapData.weeks.map((week) => {
                const isWeekExpanded = expandedWeeks[week.weekNumber];
                const weekTotalTasks = week.days.reduce((sum, day) => sum + day.tasks.length, 0);
                const weekCompletedTasks = week.days.reduce((sum, day) => {
                  return sum + day.tasks.filter(task => isTaskCompleted(task.id)).length;
                }, 0);
                const weekProgress = weekTotalTasks > 0 ? Math.round((weekCompletedTasks / weekTotalTasks) * 100) : 0;

                return (
                  <div key={week.weekNumber} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Week Header */}
                    <button
                      onClick={() => toggleWeek(week.weekNumber)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {isWeekExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-gray-800">
                            Week {week.weekNumber}: {week.title}
                          </h2>
                          <p className="text-sm text-gray-600 mt-1">
                            {weekCompletedTasks} / {weekTotalTasks} tasks completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">{weekProgress}%</div>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${weekProgress}%` }}
                          />
                        </div>
                      </div>
                    </button>

                    {/* Week Content - Days */}
                    {isWeekExpanded && (
                      <div className="border-t border-gray-200">
                        {week.days.map((day) => {
                          const dayKey = `${week.weekNumber}-${day.day}`;
                          const isDayExpanded = expandedDays[dayKey];
                          const dayId = `w${week.weekNumber}d${day.day}`;
                          const dayCompletedTasks = day.tasks.filter(task => isTaskCompleted(task.id)).length;
                          const dayProgress = Math.round((dayCompletedTasks / day.tasks.length) * 100);
                          const daySkipped = isDaySkipped(dayId);

                          return (
                            <div key={day.day} className="border-b border-gray-100 last:border-b-0">
                              {/* Day Header */}
                              <button
                                onClick={() => toggleDay(week.weekNumber, day.day)}
                                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-center gap-4">
                                  {isDayExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                  <Calendar className="w-5 h-5 text-indigo-500" />
                                  <div className="text-left">
                                    <h3 className="font-semibold text-gray-800">
                                      Day {day.day}: {day.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      {day.topics.map((topic, idx) => (
                                        <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                          {topic}
                                        </span>
                                      ))}
                                      {daySkipped && (
                                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                          Skipped
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-600">
                                    {dayCompletedTasks}/{day.tasks.length}
                                  </span>
                                  <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${dayProgress}%` }}
                                    />
                                  </div>
                                </div>
                              </button>

                              {/* Day Content */}
                              {isDayExpanded && (
                                <div className="px-6 pb-4 bg-gray-50">
                                  {/* Subtopics & Resources */}
                                  {day.subtopics && day.subtopics.length > 0 && (
                                    <div className="mb-4">
                                      <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Resources
                                      </h4>
                                      {day.subtopics.map((subtopic, idx) => (
                                        <div key={idx} className="mb-3">
                                          <div className="font-medium text-sm text-gray-700 mb-1">{subtopic.name}</div>
                                          <div className="flex flex-wrap gap-2">
                                            {subtopic.resources.map((resource, rIdx) => (
                                              <a
                                                key={rIdx}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100 transition-colors flex items-center gap-1"
                                              >
                                                {resource.title}
                                                <ExternalLink className="w-3 h-3" />
                                              </a>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Tasks */}
                                  <div className="space-y-2 mb-4">
                                    {day.tasks.map((task) => {
                                      const completed = isTaskCompleted(task.id);
                                      return (
                                        <div
                                          key={task.id}
                                          className={`p-3 rounded-lg border-2 transition-all ${
                                            completed 
                                              ? 'bg-green-50 border-green-200' 
                                              : 'bg-white border-gray-200'
                                          }`}
                                        >
                                          <div className="flex items-start gap-3">
                                            <button
                                              onClick={() => handleToggleTask(task.id)}
                                              className="mt-1 flex-shrink-0"
                                            >
                                              {completed ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                              ) : (
                                                <Circle className="w-5 h-5 text-gray-400" />
                                              )}
                                            </button>
                                            <div className="flex-1">
                                              <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                  <div className={`font-medium ${completed ? 'text-green-900 line-through' : 'text-gray-800'}`}>
                                                    {task.title}
                                                  </div>
                                                  <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded ${
                                                      task.type === 'practice' ? 'bg-purple-100 text-purple-700' :
                                                      task.type === 'study' ? 'bg-blue-100 text-blue-700' :
                                                      'bg-orange-100 text-orange-700'
                                                    }`}>
                                                      {task.type}
                                                    </span>
                                                    {task.difficulty && (
                                                      <span className={`text-xs px-2 py-0.5 rounded ${
                                                        task.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                        task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                      }`}>
                                                        {task.difficulty}
                                                      </span>
                                                    )}
                                                    {task.estimatedTime && (
                                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {task.estimatedTime}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                                {task.url && (
                                                  <a
                                                    href={task.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-700"
                                                  >
                                                    <ExternalLink className="w-4 h-4" />
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Mastery Checkpoint */}
                                  {day.masteryCheckpoint && (
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                                      <div className="font-semibold text-purple-900 text-sm mb-1">
                                        🎯 Mastery Checkpoint
                                      </div>
                                      <div className="text-sm text-purple-700">{day.masteryCheckpoint}</div>
                                    </div>
                                  )}

                                  {/* Notes Section */}
                                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <StickyNote className="w-4 h-4 text-gray-600" />
                                      <label className="text-sm font-medium text-gray-700">Notes</label>
                                    </div>
                                    <textarea
                                      value={getDayNote(dayId)}
                                      onChange={(e) => handleUpdateNote(dayId, e.target.value)}
                                      placeholder={isAuthenticated ? "Add your notes and learnings..." : "Login to add notes"}
                                      disabled={!isAuthenticated}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                                      rows="3"
                                    />
                                  </div>

                                  {/* Skip Day Button */}
                                  <button
                                    onClick={() => handleToggleSkipDay(dayId)}
                                    className={`mt-2 text-sm px-3 py-1 rounded ${
                                      daySkipped 
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } transition-colors`}
                                  >
                                    {daySkipped ? 'Unskip Day' : 'Skip Day'}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">💡 Success Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Daily Streak:</strong> Complete at least one task daily to maintain your streak!</li>
                <li>• <strong>Beat Your Record:</strong> Try to surpass your max streak!</li>
                <li>• <strong>Visualize Progress:</strong> Use the activity heatmap to see your consistency</li>
                <li>• <strong>Pattern Recognition:</strong> Focus on understanding patterns, not memorizing</li>
                <li>• <strong>Notes:</strong> Document your learnings for each day</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Import Your 110-Day Roadmap
              </h3>
              <p className="text-gray-600 mb-4">
                Add your complete roadmap data to src/data/roadmapData.js
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
                <p className="text-sm text-blue-800">
                  The roadmap component will display here once you add your data. Import the WeekCard and 
                  DayCard components to display the full roadmap.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;