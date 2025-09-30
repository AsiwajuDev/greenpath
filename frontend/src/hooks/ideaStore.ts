import { create } from "zustand";
import { BusinessIdea, ValidationResult } from "../../../shared/types";

interface IdeaState {
  ideas: BusinessIdea[];
  currentIdea: BusinessIdea | null;
  isLoading: boolean;
  validationResult: ValidationResult | null;

  addIdea: (
    idea: Omit<
      BusinessIdea,
      "id" | "createdAt" | "updatedAt" | "userId" | "status"
    >
  ) => Promise<string>;
  updateIdea: (id: string, updates: Partial<BusinessIdea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  validateIdea: (ideaData: any) => Promise<ValidationResult>;
  setCurrentIdea: (idea: BusinessIdea | null) => void;
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  currentIdea: null,
  isLoading: false,
  validationResult: null,

  addIdea: async (ideaData) => {
    set({ isLoading: true });

    const newIdea: BusinessIdea = {
      id: Math.random().toString(36).substr(2, 9),
      ...ideaData,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: "demo-user",
      status: "draft",
    };

    set((state) => ({
      ideas: [newIdea, ...state.ideas],
      isLoading: false,
    }));

    return newIdea.id;
  },

  updateIdea: async (id, updates) => {
    set((state) => ({
      ideas: state.ideas.map((idea) =>
        idea.id === id ? { ...idea, ...updates, updatedAt: new Date() } : idea
      ),
    }));
  },

  deleteIdea: async (id) => {
    set((state) => ({
      ideas: state.ideas.filter((idea) => idea.id !== id),
    }));
  },

  validateIdea: async (ideaData) => {
    set({ isLoading: true });

    try {
      // Mock API call to our backend function
      const response = await fetch(
        "http://localhost:5001/greenpath-functions/us-central1/api/validate-idea",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(ideaData),
        }
      );

      const result = await response.json();
      set({ validationResult: result, isLoading: false });
      return result;
    } catch (error) {
      // Fallback to local validation if backend is unavailable
      console.log("Using local validation fallback");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResult: ValidationResult = {
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        confidence: 85 + Math.random() * 15,
        risks: [
          "Market competition in sustainable sector",
          "Regulatory compliance challenges",
        ],
        opportunities: [
          "Growing demand for sustainable products",
          "Government incentives available",
        ],
        recommendations: [
          "Conduct thorough market research",
          "Develop a detailed sustainability impact report",
        ],
        sdgAlignment: [7, 11, 13],
      };

      set({ validationResult: mockResult, isLoading: false });
      return mockResult;
    }
  },

  setCurrentIdea: (idea) => {
    set({ currentIdea: idea });
  },
}));
