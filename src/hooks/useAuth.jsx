// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { api } from '../services/api';
import { X, Loader2 } from 'lucide-react';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          setCurrentUser(session.user);
          const profile = await api.getUserProfile(session.user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          setCurrentUser(session.user);
          try {
            const profile = await api.getUserProfile(session.user.id);
            setUserProfile(profile);
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signup = async (username, email, password) => {
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    try {
      setIsLoading(true);
      const data = await api.signUp(username, email, password);
      
      // Note: User will need to verify email before logging in
      return data;
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      setIsLoading(true);
      const data = await api.signIn(email, password);
      return data;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.signOut();
      setCurrentUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentUser,
    userProfile,
    session,
    isLoading,
    isAuthenticated: !!currentUser,
    signup,
    login,
    logout
  };
};