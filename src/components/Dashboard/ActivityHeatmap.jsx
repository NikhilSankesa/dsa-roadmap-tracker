// src/components/Dashboard/ActivityHeatmap.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

export const ActivityHeatmap = ({ activityData }) => {
  const entries = Object.entries(activityData);
  const maxTasks = Math.max(...Object.values(activityData), 1);
  
  const getColor = (count) => {
    if (count === 0) return 'bg-gray-200';
    const intensity = Math.ceil((count / maxTasks) * 3);
    const colors = ['bg-gray-200', 'bg-green-200', 'bg-green-400', 'bg-green-600'];
    return colors[intensity];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Activity Streak (Last 90 Days)
        </h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            Less
            <div className="flex gap-1 ml-1">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <div className="w-3 h-3 bg-green-200 rounded"></div>
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <div className="w-3 h-3 bg-green-600 rounded"></div>
            </div>
            More
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-[repeat(auto-fill,minmax(12px,1fr))] gap-1">
        {entries.map(([date, count]) => (
          <div
            key={date}
            className={`w-3 h-3 rounded ${getColor(count)}`}
            title={`${date}: ${count} tasks`}
          />
        ))}
      </div>
    </div>
  );
};