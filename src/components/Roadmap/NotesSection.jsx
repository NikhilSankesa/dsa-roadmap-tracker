
// src/components/Roadmap/NotesSection.jsx
import React from 'react';
import { BookMarked } from 'lucide-react';

export const NotesSection = ({ dayId, note, onUpdateNote, isAuthenticated, onAuthRequired }) => {
  const handleChange = (e) => {
    if (!isAuthenticated) {
      onAuthRequired?.();
      return;
    }
    onUpdateNote(dayId, e.target.value);
  };

  return (
    <div className="border-t pt-4">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <BookMarked className="w-3 h-3 sm:w-4 sm:h-4" />
        Personal Notes
      </label>
      <textarea
        value={note || ''}
        onChange={handleChange}
        placeholder={
          isAuthenticated
            ? 'Add your notes, learnings, or questions...'
            : 'Login to save notes'
        }
        disabled={!isAuthenticated}
        className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-all"
        rows="3"
      />
      {!isAuthenticated && (
        <p className="text-xs text-gray-500 mt-1">
          Login to save your notes and track your progress
        </p>
      )}
    </div>
  );
};