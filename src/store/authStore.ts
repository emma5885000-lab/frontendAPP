import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id?: number;
  username: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// Créer le store avec persistance dans localStorage
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
    }),
    {
      name: 'auth-storage', // nom utilisé dans localStorage
    }
  )
);

// Fonction utilitaire pour récupérer les headers d'authentification
export const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Token ${token}` } : {};
};
