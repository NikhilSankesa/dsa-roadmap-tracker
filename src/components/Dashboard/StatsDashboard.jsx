// src/components/Dashboard/StatsDashboard.jsx
import React from 'react';
import { Flame, TrendingUp, CheckCircle, BookOpen, Target } from 'lucide-react';

export const StatsCard = ({ value, label, icon: Icon, color, borderColor }) => (
  <div className={`bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 ${borderColor}`}>
    <div className="flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">{value}</div>
        <div className="text-[10px] sm:text-xs lg:text-sm text-gray-600 truncate">{label}</div>
      </div>
      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 ${color} flex-shrink-0 ml-2`} />
    </div>
  </div>
);

export const StatsDashboard = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <StatsCard 
        value={stats.currentStreak}
        label="Current Streak"
        icon={Flame}
        color="text-orange-500"
        borderColor="border-orange-500"
      />
      
      <StatsCard 
        value={stats.maxStreak}
        label="Max Streak"
        icon={TrendingUp}
        color="text-red-500"
        borderColor="border-red-500"
      />
      
      <StatsCard 
        value={`${stats.completedCount}/${stats.totalTasks}`}
        label="Tasks Done"
        icon={CheckCircle}
        color="text-green-500"
        borderColor="border-green-500"
      />
      
      <StatsCard 
        value={`${stats.completedDays}/${stats.totalDays}`}
        label="Days Complete"
        icon={BookOpen}
        color="text-purple-500"
        borderColor="border-purple-500"
      />
      
      <StatsCard 
        value={`${stats.readinessScore}%`}
        label="Interview Ready"
        icon={Target}
        color="text-blue-500"
        borderColor="border-blue-500"
      />
    </div>
  );
};