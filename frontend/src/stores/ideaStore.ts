import { create } from 'zustand';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase/config';
import { useAuthStore } from './authStore';
import { BusinessIdea, ValidationResult } from '../../../shared/types';

interface IdeaState {
  ideas: BusinessIdea[];
  currentIdea: BusinessIdea | null;
  isLoading: boolean;
  validationResult: ValidationResult | null;
  mockValidation: (ideaData: any) => Promise<ValidationResult>;
  error: string | null;

  // Firestore operations
  addIdea: (
    ideaData: Omit<
      BusinessIdea,
      'id' | 'createdAt' | 'updatedAt' | 'userId' | 'status'
    >
  ) => Promise<string>;
  updateIdea: (id: string, updates: Partial<BusinessIdea>) => Promise<void>;
  deleteIdea: (id: string) => Promise<void>;
  validateIdea: (ideaData: any) => Promise<ValidationResult>;
  setCurrentIdea: (idea: BusinessIdea | null) => void;
  subscribeToUserIdeas: () => () => void;
  clearError: () => void;
}

export const useIdeaStore = create<IdeaState>((set, get) => ({
  ideas: [],
  currentIdea: null,
  isLoading: false,
  validationResult: null,
  error: null,

  addIdea: async (ideaData) => {
    set({ isLoading: true, error: null });

    try {
      const { user } = useAuthStore.getState();

      if (!user) {
        throw new Error('User must be authenticated to add ideas');
      }

      const ideaWithMetadata: Omit<BusinessIdea, 'id'> = {
        ...ideaData,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'draft',
      };

      const docRef = await addDoc(collection(db, 'ideas'), ideaWithMetadata);

      set({ isLoading: false });
      return docRef.id;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      // throw error;
    }
  },

  updateIdea: async (id, updates) => {
    set({ error: null });

    try {
      const ideaRef = doc(db, 'ideas', id);
      await updateDoc(ideaRef, {
        ...updates,
        updatedAt: new Date(),
      });
    } catch (error: any) {
      set({ error: error.message });
      // throw error;
    }
  },

  deleteIdea: async (id) => {
    set({ error: null });

    try {
      await deleteDoc(doc(db, 'ideas', id));
      set((state) => ({
        ideas: state.ideas.filter((idea) => idea.id !== id),
      }));
    } catch (error: any) {
      set({ error: error.message });
      // throw error;
    }
  },

  validateIdea: async (ideaData) => {
    set({ isLoading: true, error: null });

    try {
      // Use Firebase Cloud Function for validation
      const validateIdeaFunction = httpsCallable(functions, 'validateIdea');
      const result = await validateIdeaFunction(ideaData);

      const validationResult = result.data as ValidationResult;
      set({ validationResult, isLoading: false });
      return validationResult;
    } catch (error: any) {
      console.error('Validation error:', error);

      // Fallback to local validation if cloud function fails
      const mockResult: ValidationResult = await get().mockValidation(ideaData);
      set({ validationResult: mockResult, isLoading: false });
      return mockResult;
    }
  },

  // Fallback mock validation
  mockValidation: async (ideaData: any): Promise<ValidationResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const sustainabilityKeywords = [
      'renewable',
      'sustainable',
      'green',
      'eco',
      'carbon',
      'zero waste',
      'circular',
      'biodegradable',
      'organic',
      'clean energy',
      'recycling',
    ];

    const keywordMatches = sustainabilityKeywords.filter((keyword) =>
      ideaData.description.toLowerCase().includes(keyword.toLowerCase())
    );

    const baseScore = Math.min(80 + keywordMatches.length * 5, 95);
    const randomVariation = Math.random() * 20 - 10;
    const finalScore = Math.max(0, Math.min(100, baseScore + randomVariation));

    return {
      score: Math.round(finalScore),
      confidence: 85 + Math.random() * 15,
      risks: [
        'Market competition in sustainable sector',
        'Regulatory compliance challenges',
        'Higher initial production costs',
      ].slice(0, 2 + Math.floor(Math.random() * 2)),
      opportunities: [
        'Growing demand for sustainable products',
        'Government incentives and grants',
        'Positive brand perception',
      ].slice(0, 2 + Math.floor(Math.random() * 2)),
      recommendations: [
        'Conduct market research in your target region',
        'Develop a detailed sustainability impact report',
        'Explore partnership opportunities',
      ],
      sdgAlignment: [7, 11, 12, 13].sort(() => 0.5 - Math.random()).slice(0, 3),
    };
  },

  setCurrentIdea: (idea) => {
    set({ currentIdea: idea });
  },

  subscribeToUserIdeas: () => {
    const { user } = useAuthStore.getState();

    if (!user) {
      set({ ideas: [] });
      return () => {};
    }

    const q = query(
      collection(db, 'ideas'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ideas = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as BusinessIdea)
        );

        set({ ideas });
      },
      (error) => {
        console.error('Error subscribing to ideas:', error);
        set({ error: error.message });
      }
    );

    return unsubscribe;
  },

  clearError: () => set({ error: null }),
}));
