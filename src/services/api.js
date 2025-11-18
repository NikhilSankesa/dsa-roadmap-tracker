// src/services/api.js
import { supabase } from '../lib/supabaseClient';

export const api = {
  // ==================== AUTH ====================
  
  async signUp(username, email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username
        }
      }
    });
    
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },

 async signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true }; 
 },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // ==================== PROGRESS ====================
  
  async getProgress(userId) {
    const { data, error } = await supabase
      .from('user_progress')
      .select('task_id, completed_at')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Convert array to object format
    const completedTasks = {};
    data.forEach(item => {
      completedTasks[item.task_id] = item.completed_at;
    });
    
    return completedTasks;
  },

  async toggleTask(userId, taskId) {
    // Check if task exists
    const { data: existing, error: checkError } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('task_id', taskId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      // Delete if exists
      const { error } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', userId)
        .eq('task_id', taskId);
      
      if (error) throw error;
      return { action: 'deleted' };
    } else {
      // Insert if doesn't exist
      const { error } = await supabase
        .from('user_progress')
        .insert({ user_id: userId, task_id: taskId });
      
      if (error) throw error;
      return { action: 'added' };
    }
  },

  // ==================== NOTES ====================
  
  async getNotes(userId) {
    const { data, error } = await supabase
      .from('user_notes')
      .select('day_id, note_text')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Convert array to object format
    const notes = {};
    data.forEach(item => {
      notes[item.day_id] = item.note_text;
    });
    
    return notes;
  },

  async updateNote(userId, dayId, noteText) {
    const { error } = await supabase
      .from('user_notes')
      .upsert(
        {
          user_id: userId,
          day_id: dayId,
          note_text: noteText,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id,day_id' }
      );
    
    if (error) throw error;
  },

  // ==================== SKIPPED DAYS ====================
  
  async getSkippedDays(userId) {
    const { data, error } = await supabase
      .from('skipped_days')
      .select('day_id, skipped_at')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // Convert array to object format
    const skippedDays = {};
    data.forEach(item => {
      skippedDays[item.day_id] = item.skipped_at;
    });
    
    return skippedDays;
  },

  async toggleSkipDay(userId, dayId) {
    // Check if day is skipped
    const { data: existing, error: checkError } = await supabase
      .from('skipped_days')
      .select('id')
      .eq('user_id', userId)
      .eq('day_id', dayId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      // Delete if exists (unskip)
      const { error } = await supabase
        .from('skipped_days')
        .delete()
        .eq('user_id', userId)
        .eq('day_id', dayId);
      
      if (error) throw error;
      return { action: 'unskipped' };
    } else {
      // Insert if doesn't exist (skip)
      const { error } = await supabase
        .from('skipped_days')
        .insert({ user_id: userId, day_id: dayId });
      
      if (error) throw error;
      return { action: 'skipped' };
    }
  },

  // ==================== STATS ====================
  
  async getStats(userId) {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data || {
      current_streak: 0,
      max_streak: 0,
      total_tasks_completed: 0,
      last_activity_date: null
    };
  },

  async updateUserStats(userId, stats) {
    const { error } = await supabase
      .from('user_stats')
      .upsert({
        user_id: userId,
        ...stats,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
  },

  // Update streaks using database function
  async updateStreaks(userId) {
    try {
      const { error } = await supabase.rpc('update_user_streaks', {
        p_user_id: userId
      });
      
      if (error) throw error;
    } catch (err) {
      // If function doesn't exist, silently fail
      console.warn('Streak update function not available:', err);
    }
  }
};