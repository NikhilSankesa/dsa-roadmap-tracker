// src/components/Roadmap/TaskItem.jsx
import React from 'react';
import { CheckCircle, Circle, Code } from 'lucide-react';

export const TaskItem = ({ task, isCompleted, onToggle, isAuthenticated }) => {
  const handleClick = () => {
    if (!isAuthenticated) {
      alert('Please login to track your progress');
      return;
    }
    onToggle(task.id);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'hard':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div
      className={`flex items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg border transition-all ${
        isCompleted
          ? 'bg-green-50 border-green-200'
          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
      }`}
    >
      <button
        onClick={handleClick}
        className="mt-0.5 sm:mt-1 transition-transform hover:scale-110 flex-shrink-0"
        aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {isCompleted ? (
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        ) : (
          <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span
            className={`text-xs sm:text-sm break-words ${
              isCompleted
                ? 'line-through text-gray-600'
                : 'text-gray-800 font-medium'
            }`}
          >
            {task.title}
          </span>

          {/* {task.difficulty && (
            <span
              className={`text-xs px-2 py-0.5 rounded font-medium ${getDifficultyColor(
                task.difficulty
              )}`}
            >
              {task.difficulty}
            </span>
          )}

          {task.estimatedTime && (
            <span className="text-xs text-gray-500 italic">
              ({task.estimatedTime})
            </span>
          )}

          {task.type && (
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium">
              {task.type}
            </span>
          )} */}
          {task.difficulty && (
            <span
              className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded font-medium whitespace-nowrap ${getDifficultyColor(
                task.difficulty
              )}`}
            >
              {task.difficulty}
            </span>
          )}

          {task.estimatedTime && (
            <span className="text-[10px] sm:text-xs text-gray-500 italic whitespace-nowrap hidden sm:inline">
              ({task.estimatedTime})
            </span>
          )}

          {task.type && (
            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-medium whitespace-nowrap">
              {task.type}
            </span>
          )}
        </div>

        {task.url && (
          <a
            href={task.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-1 transition-colors"
          >
            <Code className="w-4 h-4" />
            <span>Solve Problem</span>
          </a>
        )}
      </div>
    </div>
  );
};