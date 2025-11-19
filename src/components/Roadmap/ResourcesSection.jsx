// src/components/Roadmap/ResourcesSection.jsx
import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';

export const ResourcesSection = ({ topics, subtopics }) => {
  if (!topics && !subtopics) return null;

      return (
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
            <div className="font-semibold text-xs sm:text-sm lg:text-base text-blue-900">
              Topics: {topics?.join(', ')}
            </div>
          </div>

          {subtopics && subtopics.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              {subtopics.map((subtopic, idx) => (
                <div key={idx} className="bg-white rounded-md p-2 sm:p-3">
                  <div className="text-xs sm:text-sm font-medium text-blue-800 mb-2">
                    📚 {subtopic.name}
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">

                {subtopic.resources.map((resource, ridx) => (
                  <a
                    key={ridx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md transition-colors font-medium"
                  >
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate max-w-[150px] sm:max-w-none">{resource.title}</span>
                  </a>
                ))}
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};