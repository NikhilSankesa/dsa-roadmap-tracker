// src/components/Roadmap/MasteryCheckpoint.jsx
import React from 'react';
import { Target } from 'lucide-react';

export const MasteryCheckpoint = ({ checkpoint }) => {
  if (!checkpoint) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Target className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-semibold text-yellow-900 mb-1">
            Mastery Checkpoint
          </div>
          <div className="text-sm text-yellow-800 leading-relaxed">
            {checkpoint}
          </div>
        </div>
      </div>
    </div>
  );
};