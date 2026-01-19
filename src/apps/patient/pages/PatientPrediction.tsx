import React, { useState, useEffect } from 'react';
import { FaBrain, FaShieldAlt, FaHeart, FaWind, FaLightbulb } from 'react-icons/fa';
import { AiOutlineLoading3Quarters, AiOutlineWarning } from 'react-icons/ai';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface PredictionData {
  health_score: number;
  relative_risk: number;
  confidence: number;
  risk_level: string;
  risk_color: string;
  risk_factors: string[];
  recommendations: {
    icon: string;
    title: string;
    description: string;
    bgClass: string;
  }[];
}

function PatientPrediction() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/health/prediction/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setPredictionData(response.data);
      } catch (err) {
        console.error('Erreur prédiction:', err);
        setError('Impossible de charger les prédictions');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPrediction();
  }, [token]);

  const getRiskStyle = (level: string) => {
    switch(level?.toLowerCase()) {
      case 'faible':
        return { bgStyle: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', text: 'text-emerald-600', light: 'bg-emerald-50' };
      case 'modéré':
        return { bgStyle: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', text: 'text-amber-600', light: 'bg-amber-50' };
      case 'élevé':
        return { bgStyle: 'linear-gradient(135deg, #f87171 0%, #dc2626 100%)', text: 'text-red-600', light: 'bg-red-50' };
      default:
        return { bgStyle: 'linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)', text: 'text-gray-600', light: 'bg-gray-50' };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AiOutlineLoading3Quarters className="w-10 h-10 text-sky-500 animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Analyse en cours...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 my-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3 text-red-700">
          <AiOutlineWarning size={20} />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!predictionData) {
    return (
      <div className="mx-4 my-4 p-4 bg-sky-50 border border-sky-200 rounded-xl">
        <p className="text-sky-700 text-sm">Aucune prédiction disponible</p>
      </div>
    );
  }

  const riskStyle = getRiskStyle(predictionData.risk_level);

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' }}>
          <FaBrain size={24} className="text-sky-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Analyse IA</h1>
          <p className="text-sm text-gray-500">Prédiction personnalisée</p>
        </div>
      </div>

      {/* Niveau de risque principal */}
      <div className="p-5 rounded-2xl text-white mb-5" style={{ background: riskStyle.bgStyle }}>
        <div className="text-center">
          <div className="text-sm opacity-90 mb-2">Niveau de risque respiratoire</div>
          <div className="text-4xl font-bold mb-2">{predictionData.risk_level}</div>
          <div className="text-sm opacity-80">
            Confiance IA: {predictionData.confidence}%
          </div>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-white p-3 rounded-xl shadow-sm text-center">
          <FaShieldAlt size={20} className="text-emerald-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-800">{predictionData.health_score}/10</div>
          <div className="text-xs text-gray-500">Score santé</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm text-center">
          <FaHeart size={20} className="text-sky-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-800">{predictionData.relative_risk}%</div>
          <div className="text-xs text-gray-500">Risque relatif</div>
        </div>
        <div className="bg-white p-3 rounded-xl shadow-sm text-center">
          <FaWind size={20} className="text-emerald-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-gray-800">{predictionData.confidence}%</div>
          <div className="text-xs text-gray-500">Confiance</div>
        </div>
      </div>

      {/* Facteurs de risque */}
      {predictionData.risk_factors.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Facteurs de risque</h2>
          <div className="space-y-2 mb-5">
            {predictionData.risk_factors.map((factor, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100">
                <AiOutlineWarning size={18} className="text-sky-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-sky-800">{factor}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recommandations */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Recommandations</h2>
      <div className="space-y-3">
        {predictionData.recommendations.length > 0 ? (
          predictionData.recommendations.map((rec, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{rec.icon}</div>
                <div>
                  <div className="font-semibold text-gray-800 mb-1">{rec.title}</div>
                  <div className="text-sm text-gray-600">{rec.description}</div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-emerald-50 p-4 rounded-xl flex items-center gap-3">
            <FaLightbulb size={20} className="text-emerald-600" />
            <span className="text-sm text-emerald-700">
              Continuez vos bonnes habitudes de santé !
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientPrediction;
