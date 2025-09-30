import React, { useState } from "react";
import { useIdeaStore } from "../stores/ideaStore";
import { ValidationResult } from "../../../shared/types";

export const IdeaForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sustainabilityGoals, setSustainabilityGoals] = useState<string[]>([]);
  const [targetMarket, setTargetMarket] = useState("");
  const [innovationLevel, setInnovationLevel] = useState<
    "Incremental" | "Transformative" | "Disruptive"
  >("Incremental");
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);

  const { addIdea, validateIdea } = useIdeaStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    try {
      const result = await validateIdea(description);
      setValidationResult(result);

      // Auto-save the idea after validation
      await addIdea({
        title,
        description,
        sustainabilityGoals,
        targetMarket,
        innovationLevel,
        validationScore: result.score,
        risks: result.risks,
        opportunities: result.opportunities,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setSustainabilityGoals([]);
      setTargetMarket("");
      setInnovationLevel("Incremental");
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Validate New Idea
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            required
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="targetMarket"
            className="block text-sm font-medium text-gray-700"
          >
            Target Market
          </label>
          <input
            type="text"
            id="targetMarket"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={targetMarket}
            onChange={(e) => setTargetMarket(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="innovationLevel"
            className="block text-sm font-medium text-gray-700"
          >
            Innovation Level
          </label>
          <select
            id="innovationLevel"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            value={innovationLevel}
            onChange={(e) => setInnovationLevel(e.target.value as any)}
          >
            <option value="Incremental">Incremental</option>
            <option value="Transformative">Transformative</option>
            <option value="Disruptive">Disruptive</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isValidating}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-300"
        >
          {isValidating ? "Validating..." : "Validate Idea"}
        </button>
      </form>

      {validationResult && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">
            Validation Results
          </h3>
          <p className="text-gray-600">Score: {validationResult.score}</p>
          <p className="text-gray-600">
            Confidence: {validationResult.confidence.toFixed(2)}%
          </p>
          <div>
            <h4 className="font-medium text-gray-700">Risks:</h4>
            <ul className="list-disc list-inside">
              {validationResult.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700">Opportunities:</h4>
            <ul className="list-disc list-inside">
              {validationResult.opportunities.map((opportunity, index) => (
                <li key={index}>{opportunity}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
