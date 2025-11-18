// src/components/Roadmap/ResourcesSection.jsx
import React from 'react';
import { ExternalLink, BookOpen } from 'lucide-react';

export const ResourcesSection = ({ topics, subtopics }) => {
  if (!topics && !subtopics) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <div className="font-semibold text-blue-900">
          Topics: {topics?.join(', ')}
        </div>
      </div>

      {subtopics && subtopics.length > 0 && (
        <div className="space-y-3">
          {subtopics.map((subtopic, idx) => (
            <div key={idx} className="bg-white rounded-md p-3">
              <div className="text-sm font-medium text-blue-800 mb-2">
                📚 {subtopic.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {subtopic.resources.map((resource, ridx) => (
                  <a
                    key={ridx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-md transition-colors font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {resource.title}
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