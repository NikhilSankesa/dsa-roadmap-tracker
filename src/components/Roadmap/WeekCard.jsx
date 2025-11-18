// src/components/Roadmap/WeekCard.jsx 
import React from 'react';
import { ChevronDown, ChevronRight, Trophy, Lock } from 'lucide-react';
import { DayCard } from './DayCard';
import { isDayCompleted } from '../../utils/calculations';

export const WeekCard = ({
  week,
  isExpanded,
  onToggleExpand,
  expandedDays,
  onToggleDayExpand,
  isLocked = false,
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
      
{/*       
{/* Week Header }
      <button
        onClick={onToggleExpand}
        className={`w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r transition-all ${
          isLocked 
            ? 'from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 cursor-pointer' 
            : 'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
        } text-white`}
      >
        <div className="flex items-center gap-3">
          {isLocked ? (
            <Lock className="w-5 h-5" />
          ) : isExpanded ? (
            <ChevronDown className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
          <Trophy className="w-5 h-5" />
          <span className="text-xl font-bold">
            Week {week.weekNumber}: {week.title}
          </span>
          {isLocked && (
            <span className="text-sm bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full font-semibold text-white border border-white/40">
              🔒 Locked
            </span>
          )}
        </div>

        {Changed text color to WHITE and added better contrast }
        <div className="flex items-center gap-4">
          <div className="text-sm bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full font-semibold text-white border border-white/40">
            {completedDaysCount}/{week.days.length} Days
          </div>
          <div className="text-sm bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full font-semibold text-white border border-white/40">
            {progressPercentage}% Complete
          </div>
        </div>
      </button>
 */}

      {/* Week Header */}
      <button
        onClick={onToggleExpand}
        className={`group w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between bg-gradient-to-r transition-all duration-300 text-white relative overflow-hidden ${
          isLocked 
            ? 'from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 cursor-pointer shadow-md hover:shadow-lg' 
            : 'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-xl'
        }`}
      >
        {/* Subtle shine effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ${isLocked ? 'opacity-50' : ''}`}></div>
        
        {/* Left side: Icons and Title */}
        <div className="flex items-center gap-2 sm:gap-3 relative z-10 flex-1 min-w-0">
          {isLocked ? (
            <div className="relative flex-shrink-0">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-200" />
              {/* Pulse animation on lock icon */}
              <span className="absolute inset-0 w-4 h-4 sm:w-5 sm:h-5 bg-white/30 rounded-full animate-ping"></span>
            </div>
          ) : isExpanded ? (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-y-0.5 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform duration-200" />
          )}
          
          <Trophy className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-all duration-200 ${isLocked ? 'opacity-50 group-hover:opacity-70' : 'group-hover:scale-110'}`} />
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 min-w-0 flex-1">
            <span className="text-sm sm:text-lg lg:text-xl font-bold truncate">
              Week {week.weekNumber}: {week.title}
            </span>
            
            {isLocked && (
              <span className="text-[10px] sm:text-xs bg-white/20 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-semibold text-white border border-white/30 animate-pulse whitespace-nowrap self-start">
                🔒 Locked
              </span>
            )}
          </div>
        </div>

        {/* Right side: Stats */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 lg:gap-4 relative z-10 flex-shrink-0 ml-2">
          <div className={`text-[10px] sm:text-xs lg:text-sm bg-white/30 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-semibold text-white border border-white/40 transition-all duration-200 whitespace-nowrap ${isLocked ? 'opacity-70' : 'group-hover:bg-white/40'}`}>
            {completedDaysCount}/{week.days.length} Days
          </div>
          <div className={`text-[10px] sm:text-xs lg:text-sm bg-white/30 backdrop-blur-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-semibold text-white border border-white/40 transition-all duration-200 whitespace-nowrap ${isLocked ? 'opacity-70' : 'group-hover:bg-white/40'}`}>
            {progressPercentage}%
          </div>
        </div>
      </button>

      {/* Week Content */}
      {isExpanded &&  !isLocked && (
        <div className="p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 bg-gray-50">
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