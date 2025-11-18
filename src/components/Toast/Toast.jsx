// src/components/Toast/Toast.jsx - Enhanced Beautiful Toast Notifications
import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, Lock } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 50));
          return newProgress > 0 ? newProgress : 0;
        });
      }, 50);

      // Auto close timer
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const config = {
    success: {
      icon: CheckCircle,
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-900',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      progressColor: 'bg-green-500',
      shadowColor: 'shadow-green-200',
    },
    error: {
      icon: AlertCircle,
      bgGradient: 'from-red-50 to-rose-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-900',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      progressColor: 'bg-red-500',
      shadowColor: 'shadow-red-200',
    },
    warning: {
      icon: AlertCircle,
      bgGradient: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-900',
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-100',
      progressColor: 'bg-yellow-500',
      shadowColor: 'shadow-yellow-200',
    },
    info: {
      icon: Info,
      bgGradient: 'from-blue-50 to-sky-50',
      borderColor: 'border-blue-300',
      textColor: 'text-blue-900',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      progressColor: 'bg-blue-500',
      shadowColor: 'shadow-blue-200',
    },
    auth: {
      icon: Lock,
      bgGradient: 'from-indigo-50 via-purple-50 to-indigo-50',
      borderColor: 'border-indigo-300',
      textColor: 'text-indigo-900',
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-100',
      progressColor: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      shadowColor: 'shadow-indigo-300',
    },
  };

  const { 
    icon: Icon, 
    bgGradient, 
    borderColor, 
    textColor, 
    iconColor, 
    iconBg,
    progressColor,
    shadowColor 
  } = config[type];

  return (
    <div 
      className={`transition-all duration-300 ${
        isExiting 
          ? 'opacity-0 translate-x-full scale-95' 
          : 'opacity-100 translate-x-0 scale-100 animate-slideInBounce'
      }`}
    >
      <div 
        className={`bg-gradient-to-br ${bgGradient} ${borderColor} border-2 rounded-lg sm:rounded-xl shadow-2xl ${shadowColor} p-3 sm:p-4 flex items-start gap-2 sm:gap-3 backdrop-blur-sm relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        
        {/* Icon with animated background */}
        <div className={`${iconBg} rounded-full p-1.5 sm:p-2 flex-shrink-0 relative z-10 animate-iconBounce`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${iconColor}`} />
          {type === 'auth' && (
            <span className="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"></span>
          )}
        </div>
        
        {/* Message content */}
        <div className={`flex-1 ${textColor} relative z-10 min-w-0 pr-1`}>
          <p className="text-xs sm:text-sm font-semibold leading-relaxed break-words">
            {message}
          </p>
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className={`${textColor} hover:bg-black/5 rounded-lg p-1 transition-all flex-shrink-0 relative z-10 hover:rotate-90 duration-200`}
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 rounded-b-lg sm:rounded-b-xl overflow-hidden">
          <div 
            className={`h-full ${progressColor} transition-all duration-50 ease-linear rounded-b-lg sm:rounded-b-xl`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component - UPDATED FOR MOBILE
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto z-[100] max-w-[calc(100vw-16px)] sm:max-w-md pointer-events-none">
      <div className="space-y-2 sm:space-y-3">
        {toasts.map((toast, index) => (
          <div 
            key={toast.id} 
            className="pointer-events-auto"
            style={{ 
              transform: `translateY(${index * 4}px)`,
              transition: 'all 0.3s ease-out'
            }}
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
              duration={toast.duration}
            />
          </div>
        ))}
      </div>
    </div>
  );
};