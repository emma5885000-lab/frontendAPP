import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Interfaces pour les données
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
  data_count: number;
}

function PredictionIA() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/health/prediction/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setPredictionData(response.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des prédictions:', err);
        setError('Impossible de charger les prédictions. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPredictionData();
    }
  }, [token]);

  // Fonction pour déterminer la couleur en fonction du niveau de risque
  const getRiskColorClasses = (riskLevel: string) => {
    switch(riskLevel?.toLowerCase()) {
      case 'faible':
        return {
          bg: 'from-emerald-100 to-emerald-200',
          border: 'border-emerald-500',
          text: 'text-emerald-600',
          darkText: 'text-emerald-800'
        };
      case 'modéré':
        return {
          bg: 'from-amber-100 to-amber-200',
          border: 'border-amber-500',
          text: 'text-amber-600',
          darkText: 'text-amber-800'
        };
      case 'élevé':
        return {
          bg: 'from-red-100 to-red-200',
          border: 'border-red-500',
          text: 'text-red-600',
          darkText: 'text-red-800'
        };
      default:
        return {
          bg: 'from-gray-100 to-gray-200',
          border: 'border-gray-500',
          text: 'text-gray-600',
          darkText: 'text-gray-800'
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Chargement des prédictions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Erreur</h3>
        <p>{error}</p>
      </div>
    );
  }

  // Si pas de données, afficher un message
  if (!predictionData) {
    return (
      <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Information</h3>
        <p>Aucune prédiction disponible pour le moment. Veuillez consulter votre médecin.</p>
      </div>
    );
  }

  const riskColors = getRiskColorClasses(predictionData.risk_level);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Prédiction IA & Recommandations Personnalisées</h1>
        <p className="text-base text-gray-500">Analyse prédictive basée sur vos données de santé</p>
      </div>

      {/* Résultat principal */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
            <Brain size={40} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Analyse prédictive par IA
            </h2>
            <p className="text-base text-gray-500">
              Basée sur vos données personnelles et votre historique médical
            </p>
          </div>
        </div>

        {/* Niveau de risque */}
        <div className={`bg-gradient-to-br ${riskColors.bg} p-6 rounded-xl border-2 ${riskColors.border} mb-6`}>
          <div className="text-center mb-4">
            <h3 className={`text-xl font-bold ${riskColors.darkText} mb-2`}>
              Votre Niveau de Risque Respiratoire IA
            </h3>
            <div className={`text-5xl font-bold ${riskColors.text}`}>
              {predictionData.risk_level}
            </div>
            <p className={`text-sm ${riskColors.darkText} mt-2`}>
              Niveau de risque {predictionData.risk_level}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg text-sm leading-relaxed" style={{ color: riskColors.darkText }}>
            Notre modèle d'IA estime que votre risque de développer des problèmes respiratoires est
            actuellement <strong>{predictionData.risk_level.toLowerCase()}</strong>. 
            {predictionData.risk_level.toLowerCase() === 'faible' && " Continuez à prendre soin de votre santé."}
            {predictionData.risk_level.toLowerCase() === 'modéré' && " Soyez vigilant et suivez nos recommandations."}
            {predictionData.risk_level.toLowerCase() === 'élevé' && " Consultez rapidement votre médecin."}
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-5 bg-gray-50 rounded-xl">
            <div className="text-4xl font-bold text-emerald-500 mb-2">
              {predictionData.health_score}<span className="text-xl">/10</span>
            </div>
            <div className="text-sm text-gray-500">Score de santé</div>
          </div>
          <div className="text-center p-5 bg-gray-50 rounded-xl">
            <div className="text-4xl font-bold text-blue-500 mb-2">
              {predictionData.relative_risk}%
            </div>
            <div className="text-sm text-gray-500">Risque relatif</div>
          </div>
          <div className="text-center p-5 bg-gray-50 rounded-xl">
            <div className="text-4xl font-bold text-purple-500 mb-2">
              {predictionData.confidence}%
            </div>
            <div className="text-sm text-gray-500">Confiance IA</div>
          </div>
        </div>
      </div>

      {/* Facteurs de risque */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">
          Facteurs de Risque Identifiés
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictionData.risk_factors.length > 0 ? (
            predictionData.risk_factors.map((facteur, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-amber-800">{facteur}</span>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun facteur de risque identifié</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommandations */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-5 text-gray-800">
          Recommandations Personnalisées
        </h3>
        <div className="flex flex-col gap-4">
          {predictionData.recommendations.length > 0 ? (
            predictionData.recommendations.map((rec, index) => (
              <div key={index} className={`flex gap-4 p-5 ${rec.bgClass} rounded-xl`}>
                <div className="text-3xl flex-shrink-0">{rec.icon}</div>
                <div>
                  <div className="text-base font-semibold text-gray-800 mb-2">
                    {rec.title}
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {rec.description}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune recommandation disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PredictionIA;