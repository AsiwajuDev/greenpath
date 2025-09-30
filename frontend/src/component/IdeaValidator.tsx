import React, { useState } from "react";
import { useIdeaStore } from "../hooks/ideaStore";

export const IdeaValidator: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetMarket: "",
    innovationLevel: "Incremental" as const,
    sustainabilityGoals: [] as string[],
  });

  const { validateIdea, validationResult, isLoading } = useIdeaStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await validateIdea(formData);
  };

  const handleChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Sustainable Idea Validator
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Idea Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Solar-powered community garden"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe your sustainable business idea in detail..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Market
            </label>
            <input
              type="text"
              value={formData.targetMarket}
              onChange={(e) => handleChange("targetMarket", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Urban communities, Small businesses"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Innovation Level
            </label>
            <select
              value={formData.innovationLevel}
              onChange={(e) => handleChange("innovationLevel", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Incremental">Incremental Improvement</option>
              <option value="Transformative">Transformative Change</option>
              <option value="Disruptive">Disruptive Innovation</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {isLoading ? "Validating..." : "Validate Sustainability Impact"}
          </button>
        </form>

        {validationResult && (
          <div className="mt-8 p-6 bg-green-50 rounded-lg">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Validation Results
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-green-700 mb-2">
                  Sustainability Score
                </h4>
                <div className="text-4xl font-bold text-green-600">
                  {validationResult.score}/100
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${validationResult.score}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Confidence: {validationResult.confidence.toFixed(1)}%
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-semibold text-green-700 mb-2">
                  SDG Alignment
                </h4>
                <div className="flex flex-wrap gap-2">
                  {validationResult.sdgAlignment.map((sdg) => (
                    <span
                      key={sdg}
                      className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm"
                    >
                      SDG {sdg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">
                  Potential Risks
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.risks.map((risk, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-green-600 mb-2">
                  Opportunities
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.opportunities.map((opportunity, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-blue-600 mb-2">
                Recommendations
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {validationResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
