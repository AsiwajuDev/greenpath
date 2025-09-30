import React from "react";
import { useIdeaStore } from "../hooks/ideaStore";
import { IdeaCard } from "./IdeaCard";

export const Dashboard: React.FC = () => {
  const { ideas } = useIdeaStore();

  const averageScore =
    ideas.length > 0
      ? Math.round(
          ideas.reduce((sum, idea) => sum + idea.validationScore, 0) /
            ideas.length
        )
      : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Sustainability Dashboard
        </h1>
        <p className="text-gray-600">
          Track and manage your sustainable business ideas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Ideas</h3>
          <p className="text-3xl font-bold text-green-600">{ideas.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Average Score</h3>
          <p className="text-3xl font-bold text-green-600">
            {averageScore}/100
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">
            Impact Potential
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {ideas.filter((i) => i.validationScore >= 70).length} High
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Your Sustainable Ideas
          </h2>
        </div>

        <div className="p-6">
          {ideas.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No ideas yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by validating your first sustainable business idea
              </p>
              <a
                href="/validate"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Validate First Idea
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
