// src/hooks/useToast.js
import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Helper methods for different toast types
  const success = useCallback((message, duration = 3000) => 
    showToast(message, 'success', duration), [showToast]);
  
  const error = useCallback((message, duration = 3000) => 
    showToast(message, 'error', duration), [showToast]);
  
  const warning = useCallback((message, duration = 3000) => 
    showToast(message, 'warning', duration), [showToast]);
  
  const info = useCallback((message, duration = 3000) => 
    showToast(message, 'info', duration), [showToast]);
  
  const auth = useCallback((message, duration = 4000) => 
    showToast(message, 'auth', duration), [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
    auth,
  };
};