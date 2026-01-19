import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface PatientAuthProps {
  register?: boolean;
}

function PatientAuth({ register = false }: PatientAuthProps) {
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  
  const [isRegister, setIsRegister] = useState(register);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          setError('Les mots de passe ne correspondent pas');
          setLoading(false);
          return;
        }
        
        await axios.post(`${API_BASE}/auth/register/`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'patient'
        });
        
        // Auto-login après inscription
        const loginRes = await axios.post(`${API_BASE}/auth/login/`, {
          username: formData.username,
          password: formData.password
        });
        
        login(loginRes.data.token, {
          username: loginRes.data.user.username,
          email: loginRes.data.user.email,
          role: 'patient'
        });
        
        navigate('/patient');
      } else {
        const response = await axios.post(`${API_BASE}/auth/login/`, {
          username: formData.username,
          password: formData.password
        });
        
        login(response.data.token, {
          username: response.data.user.username,
          email: response.data.user.email,
          role: response.data.user.role || 'patient'
        });
        
        navigate('/patient');
      }
    } catch (err: any) {
      console.error('Erreur auth:', err);
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 to-sky-600 flex flex-col">
      {/* Header */}
      <div className="text-center pt-12 pb-8 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
          H
        </div>
        <h1 className="text-2xl font-bold">HEALTH TIC</h1>
        <p className="text-sky-100 text-sm mt-1">Votre santé connectée</p>
      </div>

      {/* Formulaire */}
      <div className="flex-1 bg-white rounded-t-3xl px-6 pt-8 pb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {isRegister ? 'Créer un compte' : 'Connexion'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isRegister 
            ? 'Rejoignez HEALTH TIC pour suivre votre santé' 
            : 'Connectez-vous pour accéder à vos données'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <FaUser size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Votre nom d'utilisateur"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Email (inscription uniquement) */}
          {isRegister && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <div className="relative">
                <FaEnvelope size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Mot de passe
            </label>
            <div className="relative">
              <FaLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password (inscription uniquement) */}
          {isRegister && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <FaLock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 active:bg-emerald-600 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters size={20} className="animate-spin" />
                <span>Chargement...</span>
              </>
            ) : (
              <span>{isRegister ? 'Créer mon compte' : 'Se connecter'}</span>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="ml-1 text-sky-600 font-semibold"
            >
              {isRegister ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </p>
        </div>

        {/* Lien médecin */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-2">Vous êtes médecin ?</p>
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-sky-600 font-medium"
          >
            Accéder à l'espace médecin →
          </button>
        </div>
      </div>
    </div>
  );
}

export default PatientAuth;
