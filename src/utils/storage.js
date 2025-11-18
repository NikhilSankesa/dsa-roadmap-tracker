// src/utils/storage.js
// Local Storage utility functions for user data and progress

export const storage = {
  // User Authentication
  getUsers: () => {
    return JSON.parse(localStorage.getItem('dsaUsers') || '{}');
  },
  
  saveUser: (username, password) => {
    const users = storage.getUsers();
    users[username] = {
      password,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('dsaUsers', JSON.stringify(users));
  },
  
  getUserByUsername: (username) => {
    const users = storage.getUsers();
    return users[username] || null;
  },
  
  // Current User Session
  getCurrentUser: () => {
    return localStorage.getItem('currentUser');
  },
  
  setCurrentUser: (username) => {
    localStorage.setItem('currentUser', username);
  },
  
  removeCurrentUser: () => {
    localStorage.removeItem('currentUser');
  },
  
  // User Progress
  getUserProgress: (username) => {
    if (!username) return null;
    const saved = localStorage.getItem(`dsaProgress_${username}`);
    return saved ? JSON.parse(saved) : null;
  },
  
  saveUserProgress: (username, progress) => {
    if (!username) return;
    localStorage.setItem(`dsaProgress_${username}`, JSON.stringify(progress));
  },
  
  // Initialize new user progress
  createNewProgress: () => {
    return {
      completedTasks: {},  // Object: { taskId: timestamp }
      notes: {},           // Object: { dayId: noteText }
      skippedDays: {},     // Object: { dayId: timestamp }
      startDate: new Date().toISOString()
    };
  },
  
  // Clear all data (for testing/reset)
  clearAllData: () => {
    localStorage.clear();
  }
};