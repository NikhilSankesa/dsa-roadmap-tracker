// src/components/Auth/AuthModal.jsx - COMPLETE WITH ALL FIXES
import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onLogin, onSignup }) => {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      setLoading(false);
    }
  }, [isOpen]);

  const switchMode = (mode) => {
    setAuthMode(mode);
    setError('');
    setSuccess('');
    setFormData({ username: '', email: '', password: '' });
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    setFormData({ username: '', email: '', password: '' });
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (authMode === 'login') {
        await onLogin(formData.email, formData.password);
        setSuccess('Login successful!');
        setFormData({ username: '', email: '', password: '' });
        setTimeout(() => handleClose(), 1000);
      } else {
        await onSignup(formData.username, formData.email, formData.password);
        setSuccess('Account created! Please check your email to verify your account before logging in.');
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (err) {
      console.error('Auth error:', err);
      
      let errorMessage = 'An error occurred';
      
      if (err.message) {
        errorMessage = err.message;
      }
      
      // Make error messages more user-friendly
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Please verify your email before logging in. Check your inbox.';
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'This email is already registered. Try logging in instead.';
      } else if (errorMessage.includes('Unable to validate email address')) {
        errorMessage = 'Please enter a valid email address.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-start gap-2">
            <span className="text-lg">✅</span>
            <span>{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Choose a username"
                disabled={loading}
                autoComplete="username"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="your.email@example.com"
              disabled={loading}
              autoComplete="email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder={authMode === 'signup' ? 'Min. 6 characters' : 'Enter password'}
              disabled={loading}
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={authMode === 'signup' ? 6 : undefined}
            />
            {authMode === 'signup' && (
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {authMode === 'login' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              authMode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          {authMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => switchMode('signup')}
                disabled={loading}
                className="text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => switchMode('login')}
                disabled={loading}
                className="text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
              >
                Sign In
              </button>
            </>
          )}
        </div>

        {authMode === 'signup' && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              📧 You'll receive a verification email after signing up. Please check your inbox and verify your account before logging in.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};