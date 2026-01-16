import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../api";
import { AxiosError } from "axios";
import { useAuthStore } from "../store/authStore";

const AuthForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // ajouté pour le rôle
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    console.log("Tentative de connexion/inscription avec:", { email, password, isLogin });

    try {
      let data;
      if (isLogin) {
        // Connexion
        console.log("Envoi de la requête de connexion...");
        data = await loginUser(email, password);
        console.log("Réponse de connexion reçue:", data);
      } else {
        // Inscription
        console.log("Envoi de la requête d'inscription...");
        data = await registerUser(username, email, password, role);
        console.log("Réponse d'inscription reçue:", data);
      }

      // Vérifier la structure de la réponse
      console.log("Structure de la réponse:", JSON.stringify(data));
      
      if (!data || !data.token || !data.user) {
        console.error("Réponse invalide:", data);
        setMessage("Format de réponse invalide du serveur");
        return;
      }

      // Stocker les informations dans le store Zustand
      console.log("Stockage des informations dans le store Zustand");
      const login = useAuthStore.getState().login;
      login(data.token, {
        username: data.user.username,
        email: data.user.email,
        role: data.user.role
      });
      
      // Redirection vers Accueil
      console.log("Connexion réussie, redirection...");
      navigate("/");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Erreur complète:", error);
      if (error.response) {
        console.error("Réponse serveur:", error.response.data);
        console.error("Status:", error.response.status);
        setMessage(JSON.stringify(error.response.data));
      } else if (error.request) {
        console.error("Pas de réponse du serveur:", error.request);
        setMessage("Le serveur ne répond pas. Vérifiez que le backend est démarré.");
      } else {
        console.error("Erreur:", error.message);
        setMessage("Erreur: " + error.message);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-10 rounded-xl shadow-lg text-center bg-white">
      <h2 className="mb-6 text-2xl font-bold text-blue-900">
        {isLogin ? "Connexion" : "Inscription"}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choisissez votre rôle</option>
              <option value="doctor">Docteur</option>
              <option value="patient">Patient</option>
            </select>
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 rounded-lg bg-blue-600 text-white font-semibold text-base cursor-pointer transition-colors hover:bg-blue-800"
        >
          {isLogin ? "Se connecter" : "S'inscrire"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
          className="bg-transparent border-none text-blue-600 cursor-pointer font-semibold hover:underline"
        >
          {isLogin ? "Inscrivez-vous" : "Connectez-vous"}
        </button>
      </p>

      {message && <p className="mt-4 text-red-500 text-sm">{message}</p>}
    </div>
  );
};

export default AuthForm;
