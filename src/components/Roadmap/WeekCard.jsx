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
        className={`group w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r transition-all duration-300 text-white relative overflow-hidden ${
          isLocked 
            ? 'from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 cursor-pointer shadow-md hover:shadow-lg' 
            : 'from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md hover:shadow-xl'
        }`}
      >
        {/* Subtle shine effect on hover */}
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ${isLocked ? 'opacity-50' : ''}`}></div>
        
        <div className="flex items-center gap-3 relative z-10">
          {isLocked ? (
            <div className="relative">
              <Lock className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              {/* Pulse animation on lock icon */}
              <span className="absolute inset-0 w-5 h-5 bg-white/30 rounded-full animate-ping"></span>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover/lock:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                Click to unlock
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
              </div>
            </div>
          ) : isExpanded ? (
            <ChevronDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform duration-200" />
          ) : (
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200" />
          )}
          
          <Trophy className={`w-5 h-5 transition-all duration-200 ${isLocked ? 'opacity-50 group-hover:opacity-70' : 'group-hover:scale-110'}`} />
          
          <span className="text-xl font-bold group-hover:translate-x-1 transition-transform duration-200">
            Week {week.weekNumber}: {week.title}
          </span>
          
          {isLocked && (
            <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full font-semibold text-white border border-white/30 animate-pulse">
              🔒 Locked
            </span>
          )}
        </div>

        {/* Stats on the right */}
        <div className="flex items-center gap-4 relative z-10">
          <div className={`text-sm bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full font-semibold text-white border border-white/40 transition-all duration-200 ${isLocked ? 'opacity-70' : 'group-hover:bg-white/40'}`}>
            {completedDaysCount}/{week.days.length} Days
          </div>
          <div className={`text-sm bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full font-semibold text-white border border-white/40 transition-all duration-200 ${isLocked ? 'opacity-70' : 'group-hover:bg-white/40'}`}>
            {progressPercentage}% Complete
          </div>
        </div>
      </button>

      {/* Week Content */}
      {isExpanded &&  !isLocked && (
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