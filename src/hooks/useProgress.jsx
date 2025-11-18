// src/hooks/useProgress.js - WITH DEBOUNCING IMPLEMENTED
import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const emptyProgress = {
  completedTasks: {},
  notes: {},
  skippedDays: {},
  stats: {
    current_streak: 0,
    max_streak: 0,
    total_tasks_completed: 0
  },
  startDate: new Date().toISOString()
};

export const useProgress = (currentUser) => {
  const [userProgress, setUserProgress] = useState(emptyProgress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // useRef to store debounce timer
  const noteTimers = useRef({});

  // Load user progress when user changes
  useEffect(() => {
    if (currentUser?.id) {
      loadProgress();
    } else {
      setUserProgress(emptyProgress);
    }
  }, [currentUser?.id]);

  const loadProgress = async () => {
    if (!currentUser?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const [progress, notes, skippedDays, stats] = await Promise.all([
        api.getProgress(currentUser.id),
        api.getNotes(currentUser.id),
        api.getSkippedDays(currentUser.id),
        api.getStats(currentUser.id)
      ]);

      setUserProgress({
        completedTasks: progress,
        notes,
        skippedDays,
        stats,
        startDate: currentUser.created_at || new Date().toISOString()
      });
    } catch (err) {
      console.error('Error loading progress:', err);
      setError(err.message);
      setUserProgress(emptyProgress);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = async (taskId) => {
    if (!currentUser?.id) {
      throw new Error('Please login to track progress');
    }

    try {
      setError(null);
      
      // Optimistic update
      setUserProgress(prev => {
        const newCompleted = { ...prev.completedTasks };
        if (newCompleted[taskId]) {
          delete newCompleted[taskId];
        } else {
          newCompleted[taskId] = new Date().toISOString();
        }
        return { ...prev, completedTasks: newCompleted };
      });

      // Update in database
      await api.toggleTask(currentUser.id, taskId);
      
      // Update stats after task toggle
      try {
        await api.updateStreaks(currentUser.id);
        const stats = await api.getStats(currentUser.id);
        setUserProgress(prev => ({ ...prev, stats }));
      } catch (statsErr) {
        console.error('Error updating stats:', statsErr);
      }
      
    } catch (err) {
      console.error('Error toggling task:', err);
      setError(err.message);
      await loadProgress();
    }
  };

  // DEBOUNCED updateNote function
  const updateNote = async (dayId, note) => {
    if (!currentUser?.id) {
      throw new Error('Please login to save notes');
    }

    try {
      setError(null);
      
      // Update UI immediately (feels instant to user)
      setUserProgress(prev => ({
        ...prev,
        notes: { ...prev.notes, [dayId]: note }
      }));

      // Clear existing timer for this day
      if (noteTimers.current[dayId]) {
        clearTimeout(noteTimers.current[dayId]);
      }

      // Set new timer - save after 1 second of no typing
      noteTimers.current[dayId] = setTimeout(async () => {
        try {
          await api.updateNote(currentUser.id, dayId, note);
          console.log(`✅ Note saved for ${dayId}`);
        } catch (err) {
          console.error('Error saving note:', err);
          setError(err.message);
        }
      }, 1000); // Wait 1 second after user stops typing
      
    } catch (err) {
      console.error('Error updating note:', err);
      setError(err.message);
    }
  };

  const toggleSkipDay = async (dayId) => {
    if (!currentUser?.id) {
      throw new Error('Please login to skip days');
    }

    try {
      setError(null);
      
      // Optimistic update
      setUserProgress(prev => {
        const newSkipped = { ...prev.skippedDays };
        if (newSkipped[dayId]) {
          delete newSkipped[dayId];
        } else {
          newSkipped[dayId] = new Date().toISOString();
        }
        return { ...prev, skippedDays: newSkipped };
      });

      // Update in database
      await api.toggleSkipDay(currentUser.id, dayId);
      
    } catch (err) {
      console.error('Error toggling skip day:', err);
      setError(err.message);
      await loadProgress();
    }
  };

  return {
    userProgress,
    isLoading,
    error,
    toggleTask,
    updateNote,
    toggleSkipDay,
    reloadProgress: loadProgress
  };
};