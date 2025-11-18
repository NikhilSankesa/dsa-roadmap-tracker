// src/utils/calculations.js
// Utility functions for calculating stats, streaks, and analytics

export const calculateCalendarStreak = (completedTasks) => {
  if (!completedTasks || Object.keys(completedTasks).length === 0) {
    return { current: 0, max: 0 };
  }
  
  // Get completion dates from object values
  const completionDates = Object.values(completedTasks)
    .map(timestamp => {
      const date = new Date(timestamp);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    });
  
  // Get unique dates and sort
  const uniqueDates = [...new Set(completionDates)].sort((a, b) => a - b);
  
  if (uniqueDates.length === 0) return { current: 0, max: 0 };
  
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;
  
  // Calculate current streak
  const lastActivityDate = uniqueDates[uniqueDates.length - 1];
  const daysSinceLastActivity = Math.floor((todayStart - lastActivityDate) / oneDayMs);
  
  let currentStreak = 0;
  if (daysSinceLastActivity <= 1) {
    currentStreak = 1;
    for (let i = uniqueDates.length - 1; i > 0; i--) {
      const dayDiff = (uniqueDates[i] - uniqueDates[i - 1]) / oneDayMs;
      if (dayDiff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }
  
  // Calculate max streak
  let maxStreak = 1;
  let tempStreak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const dayDiff = (uniqueDates[i] - uniqueDates[i - 1]) / oneDayMs;
    if (dayDiff === 1) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }
  
  return { 
    current: currentStreak, 
    max: Math.max(maxStreak, currentStreak) 
  };
};

export const getActivityData = (completedTasks, days = 90) => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (days - 1));
  
  const activityMap = {};
  
  // Initialize all dates with 0
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    activityMap[dateKey] = 0;
  }
  
  // Count tasks per day - completedTasks is an object where keys are taskIds and values are timestamps
  if (completedTasks && typeof completedTasks === 'object') {
    Object.values(completedTasks).forEach(timestamp => {
      const date = new Date(timestamp).toISOString().split('T')[0];
      if (activityMap.hasOwnProperty(date)) {
        activityMap[date]++;
      }
    });
  }
  
  return activityMap;
};

export const calculateStats = (roadmapData, userProgress) => {
  // Ensure roadmapData exists and has weeks
  if (!roadmapData || !roadmapData.weeks || !Array.isArray(roadmapData.weeks)) {
    return {
      totalTasks: 0,
      completedCount: 0,
      completionPercentage: 0,
      currentStreak: 0,
      maxStreak: 0,
      readinessScore: 0,
      completedDays: 0,
      totalDays: 0
    };
  }

  const totalTasks = roadmapData.weeks.reduce((acc, week) => 
    acc + week.days.reduce((dayAcc, day) => dayAcc + day.tasks.length, 0), 0
  );
  
  // completedTasks is an object, so use Object.keys to get count
  const completedCount = userProgress.completedTasks ? Object.keys(userProgress.completedTasks).length : 0;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedCount / totalTasks) * 100) 
    : 0;
  
  const streakData = calculateCalendarStreak(userProgress.completedTasks || {});

  const totalDays = roadmapData.weeks.reduce((acc, week) => acc + week.days.length, 0);
  
  // Extract unique day numbers from completed task IDs
  const completedDaysSet = new Set();
  if (userProgress.completedTasks && typeof userProgress.completedTasks === 'object') {
    Object.keys(userProgress.completedTasks).forEach(taskId => {
      const match = taskId.match(/^d(\d+)/);
      if (match) {
        completedDaysSet.add(parseInt(match[1]));
      }
    });
  }
  
  const completedDays = completedDaysSet.size;
  const readinessScore = totalDays > 0 
    ? Math.round((completedDays / totalDays) * 100)
    : 0;

  return {
    totalTasks,
    completedCount,
    completionPercentage,
    currentStreak: streakData.current,
    maxStreak: streakData.max,
    readinessScore,
    completedDays,
    totalDays
  };
};

export const isDayCompleted = (day, completedTasks) => {
  // completedTasks is an object where keys are taskIds
  if (!completedTasks || typeof completedTasks !== 'object') {
    return false;
  }
  return day.tasks.every(task => completedTasks[task.id]);
};

export const getMotivationMessage = (stats) => {
  const { completionPercentage, currentStreak } = stats;
  
  if (currentStreak >= 7) return `🔥 Amazing! ${currentStreak}-day streak! You're unstoppable!`;
  if (currentStreak >= 3) return `💪 ${currentStreak}-day streak! Keep the momentum going!`;
  if (completionPercentage === 0) return "🎯 Begin your journey to DSA mastery!";
  if (completionPercentage < 10) return "🌱 Great start! Keep the momentum going!";
  if (completionPercentage < 25) return "💪 You're building strong foundations!";
  if (completionPercentage < 50) return "🔥 Halfway there! Your progress is impressive!";
  if (completionPercentage < 75) return "⭐ You're in the advanced zone now!";
  if (completionPercentage < 100) return "🏆 Almost there! The finish line is in sight!";
  return "🎉 Congratulations! You've mastered the roadmap!";
};