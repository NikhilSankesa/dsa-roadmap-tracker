// src/components/Roadmap/WeekCard.jsx
import React from 'react';
import { ChevronDown, ChevronRight, Trophy } from 'lucide-react';
import { DayCard } from './DayCard';
import { isDayCompleted } from '../../utils/calculations';

export const WeekCard = ({
  week,
  isExpanded,
  onToggleExpand,
  expandedDays,
  onToggleDayExpand,
  userProgress,
  onToggleTask,
  onUpdateNote,
  onToggleSkipDay,
  isAuthenticated
}) => {
  const completedDaysCount = week.days.filter((day) =>
    isDayCompleted(day, userProgress.completedTasks)
  ).length;

  const totalTasks = week.days.reduce((sum, day) => sum + day.tasks.length, 0);
  const completedTasks = week.days.reduce(
    (sum, day) =>
      sum + day.tasks.filter((task) => userProgress.completedTasks[task.id]).length,
    0
  );

  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Week Header */}
      <button
        onClick={onToggleExpand}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transition-all"
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          <Trophy className="w-5 h-5" />
          <span className="text-xl font-bold">
            Week {week.weekNumber}: {week.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full font-medium">
            {completedDaysCount}/{week.days.length} Days
          </div>
          <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full font-medium">
            {progressPercentage}% Complete
          </div>
        </div>
      </button>

      {/* Week Content */}
      {isExpanded && (
        <div className="p-6 space-y-4 bg-gray-50">
          {week.days.map((day) => {
            const dayId = `w${week.weekNumber}d${day.day}`;
            const isCompleted = isDayCompleted(day, userProgress.completedTasks);
            const isSkipped = userProgress.skippedDays[dayId];
            const completedTasksCount = day.tasks.filter(
              (t) => userProgress.completedTasks[t.id]
            ).length;

            return (
              <DayCard
                key={day.day}
                day={day}
                weekNumber={week.weekNumber}
                isExpanded={expandedDays[dayId]}
                onToggleExpand={() => onToggleDayExpand(dayId)}
                isCompleted={isCompleted}
                isSkipped={isSkipped}
                completedTasksCount={completedTasksCount}
                userProgress={userProgress}
                onToggleTask={onToggleTask}
                onUpdateNote={onUpdateNote}
                onToggleSkipDay={onToggleSkipDay}
                isAuthenticated={isAuthenticated}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};