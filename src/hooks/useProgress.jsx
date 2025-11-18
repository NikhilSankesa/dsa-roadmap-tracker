// src/hooks/useProgress.js
import { useState, useEffect } from 'react';
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
      const data = await api.getAllUserData(currentUser.id);
      setUserProgress(data);
    } catch (err) {
      console.error('Error loading progress:', err);
      setError(err.message);
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
      
      // Refresh stats
      await api.updateStreaks(currentUser.id);
      const stats = await api.getStats(currentUser.id);
      setUserProgress(prev => ({ ...prev, stats }));
      
    } catch (err) {
      console.error('Error toggling task:', err);
      setError(err.message);
      // Reload to get correct state
      await loadProgress();
    }
  };

  const updateNote = async (dayId, note) => {
    if (!currentUser?.id) {
      throw new Error('Please login to save notes');
    }

    try {
      setError(null);
      
      // Optimistic update
      setUserProgress(prev => ({
        ...prev,
        notes: { ...prev.notes, [dayId]: note }
      }));

      // Update in database (debounced in real app)
      await api.updateNote(currentUser.id, dayId, note);
      
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
      // Reload to get correct state
      await loadProgress();
    }
  };

  const resetProgress = async () => {
    if (!currentUser?.id) return;
    
    if (!confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Delete all progress for user
      await Promise.all([
        supabase.from('user_progress').delete().eq('user_id', currentUser.id),
        supabase.from('user_notes').delete().eq('user_id', currentUser.id),
        supabase.from('skipped_days').delete().eq('user_id', currentUser.id)
      ]);
      
      // Reload empty progress
      await loadProgress();
      
    } catch (err) {
      console.error('Error resetting progress:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userProgress,
    isLoading,
    error,
    toggleTask,
    updateNote,
    toggleSkipDay,
    resetProgress,
    reloadProgress: loadProgress
  };
};