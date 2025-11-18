// src/components/Roadmap/DayCard.jsx
import React from 'react';
import { CheckCircle, Circle, ChevronDown, ChevronRight, SkipForward } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { MasteryCheckpoint } from './MasteryCheckpoint';
import { NotesSection } from './NotesSection';
import { ResourcesSection } from './ResourcesSection';

export const DayCard = ({
  day,
  weekNumber,
  isExpanded,
  onToggleExpand,
  isCompleted,
  isSkipped,
  completedTasksCount,
  userProgress,
  onToggleTask,
  onUpdateNote,
  onToggleSkipDay,
  isAuthenticated
}) => {
  const dayId = `w${weekNumber}d${day.day}`;

  return (
    <div
      className={`border rounded-lg overflow-hidden transition-all ${
        isSkipped
          ? 'opacity-60 bg-gray-50 border-gray-300'
          : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Day Header */}
      <button
        onClick={onToggleExpand}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}

          {/* <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300" />
            )}
            <span className="font-semibold text-gray-800 text-left">
              Day {day.day}: {day.title}
            </span>
          </div>

          {isSkipped && (
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
              Skipped
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {completedTasksCount}/{day.tasks.length} tasks
          </span>
          {isCompleted && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
              Complete
            </span>
          )} */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {isCompleted ? (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 flex-shrink-0" />
            )}
            <span className="font-semibold text-gray-800 text-left text-sm sm:text-base truncate">
              Day {day.day}: {day.title}
            </span>
          </div>

          {isSkipped && (
            <span className="text-[10px] sm:text-xs bg-gray-200 text-gray-700 px-2 py-0.5 sm:py-1 rounded whitespace-nowrap flex-shrink-0">
              Skipped
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 flex-shrink-0 ml-2">
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">
            {completedTasksCount}/{day.tasks.length}
          </span>
          {isCompleted && (
            <span className="text-[10px] sm:text-xs bg-green-100 text-green-700 px-2 py-0.5 sm:py-1 rounded font-medium whitespace-nowrap">
              ✓
            </span>
          )}
        </div>
      </button>

      {/* Day Content */}
      {isExpanded && (
        <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-3 sm:space-y-4">
          {/* Resources Section */}
          <ResourcesSection topics={day.topics} subtopics={day.subtopics} />

          {/* Tasks List */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Tasks ({completedTasksCount}/{day.tasks.length})
            </div>
            {day.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                isCompleted={!!userProgress.completedTasks[task.id]}
                onToggle={onToggleTask}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>

          {/* Mastery Checkpoint */}
          <MasteryCheckpoint checkpoint={day.masteryCheckpoint} />

          {/* Notes Section */}
          <NotesSection
            dayId={dayId}
            note={userProgress.notes[dayId]}
            onUpdateNote={onUpdateNote}
            isAuthenticated={isAuthenticated}
          />

          {/* Skip Day Button */}
          <button
            onClick={() => onToggleSkipDay(dayId)}
            disabled={!isAuthenticated}
            className={`w-full py-2 px-4 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
              isSkipped
                ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <SkipForward className="w-4 h-4" />
            {isSkipped ? 'Unskip Day' : 'Skip Day'}
          </button>
        </div>
      )}
    </div>
  );
};