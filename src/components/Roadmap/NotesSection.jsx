
// src/components/Roadmap/NotesSection.jsx
import React from 'react';
import { BookMarked } from 'lucide-react';

export const NotesSection = ({ dayId, note, onUpdateNote, isAuthenticated }) => {
  const handleChange = (e) => {
    if (!isAuthenticated) {
      alert('Please login to save notes');
      return;
    }
    onUpdateNote(dayId, e.target.value);
  };

  return (
    <div className="border-t pt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
        <BookMarked className="w-4 h-4" />
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
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none transition-all"
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