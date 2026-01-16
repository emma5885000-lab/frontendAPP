// src/api.ts
import axios from "axios";

// URL du backend selon l'environnement
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API_URL = `${API_BASE}/users/`;

interface User {
  username: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Inscription
export const registerUser = async (username: string, email: string, password: string, role: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}register/`, { username, email, password, role });
  return response.data;
};

// Connexion
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}login/`, { email, password });
  return response.data;
};

// Ajouter le token aux requêtes sécurisées
// Cette fonction est maintenant dans authStore.ts
// On la garde ici pour compatibilité avec le code existant
export const getAuthHeaders = (): { Authorization: string } | Record<string, never> => {
  // Utiliser import pour éviter les problèmes de TypeScript
  import('./store/authStore').then(module => {
    const token = module.useAuthStore.getState().token;
    return token ? { Authorization: `Token ${token}` } : {};
  });
  
  // Fallback en attendant le chargement du module
  return {};
};
