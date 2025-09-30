import { create } from "zustand";
import { BusinessIdea, ValidationResult } from "../../../shared/types";
import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase/config";

interface IdeaState {
  ideas: BusinessIdea[];
  currentIdea: BusinessIdea | null;
  addIdea: (idea: Partial<BusinessIdea>) => Promise<void>;
  validateIdea: (idea: string) => Promise<ValidationResult>;
}

const functions = getFunctions(app);

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  currentIdea: null,
  addIdea: async (idea) => {
    // Firebase integration here
  },
  validateIdea: async (ideaText) => {
    try {
      const validateIdeaFunction = httpsCallable(functions, "validateIdea");
      const response = await validateIdeaFunction({ idea: ideaText });
      return response.data as ValidationResult;
    } catch (error) {
      console.error("Error validating idea:", error);
      throw error;
    }
  },
}));
