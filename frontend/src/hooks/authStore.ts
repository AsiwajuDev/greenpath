import { create } from 'zustand';
import { User } from '../../../shared/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    // Mock authentication
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = {
      uid: 'demo-user-123',
      email,
      displayName: email.split('@')[0],
      createdAt: new Date(),
      subscription: 'free',
    };

    set({ user, isAuthenticated: true, isLoading: false });
    // Store in localStorage
    localStorage.setItem(
      'auth',
      JSON.stringify({ user, isAuthenticated: true })
    );
  },

  signup: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = {
      uid: 'demo-user-' + Math.random().toString(36).substr(2, 9),
      email,
      displayName,
      createdAt: new Date(),
      subscription: 'free',
    };

    set({ user, isAuthenticated: true, isLoading: false });
    // Store in localStorage
    localStorage.setItem(
      'auth',
      JSON.stringify({ user, isAuthenticated: true })
    );
  },

  logout: () => {
    localStorage.removeItem('auth');
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
    // Store in localStorage
    localStorage.setItem(
      'auth',
      JSON.stringify({ user, isAuthenticated: !!user })
    );
  },

  checkAuth: () => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { user, isAuthenticated } = JSON.parse(auth);
      set({ user, isAuthenticated });
    }
  },
}));
