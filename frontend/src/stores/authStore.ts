import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User } from '../../../shared/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, authError: null });

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } else {
        // Create user document if it doesn't exist
        const newUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || email.split('@')[0],
          createdAt: new Date(),
          subscription: 'free',
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        set({ user: newUser, isAuthenticated: true, isLoading: false });
      }
    } catch (error: any) {
      set({
        authError: error.message || 'Login failed',
        isLoading: false,
      });
      alert('Login failed');
    }
  },

  signup: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, authError: null });

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const newUser: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName,
        createdAt: new Date(),
        subscription: 'free',
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({
        authError: error.message || 'Signup failed',
        isLoading: false,
      });
      alert('Signup failed');
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, isAuthenticated: false, authError: null });
    } catch (error: any) {
      set({ authError: error.message || 'Logout failed' });
      alert('Logout failed');
    }
  },

  initializeAuth: () => {
    set({ isLoading: true });

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
              const userData = userDoc.data() as User;
              set({ user: userData, isAuthenticated: true, isLoading: false });
            } else {
              // Create user document if it doesn't exist
              const newUser: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName:
                  firebaseUser.displayName || firebaseUser.email!.split('@')[0],
                createdAt: new Date(),
                subscription: 'free',
              };

              await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
              set({ user: newUser, isAuthenticated: true, isLoading: false });
            }
          } catch (error) {
            console.error('Error loading user data:', error);
            set({ isLoading: false });
          }
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      }
    );

    return unsubscribe;
  },

  clearError: () => set({ authError: null }),
}));
