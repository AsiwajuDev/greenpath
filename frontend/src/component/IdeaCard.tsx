import React from "react";
import { BusinessIdea } from "../../../shared/types";

interface IdeaCardProps {
  idea: BusinessIdea;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
      <div className="p-4 border-b">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{idea.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(
              idea.validationScore
            )}`}
          >
            {idea.validationScore}/100
          </span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2">{idea.description}</p>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Target: {idea.targetMarket}</span>
          <span className="capitalize">
            {idea.innovationLevel.toLowerCase()}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {idea.opportunities.slice(0, 2).map((opp, index) => (
            <span
              key={index}
              className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
            >
              {opp}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {new Date(idea.createdAt).toLocaleDateString()}
          </span>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};
