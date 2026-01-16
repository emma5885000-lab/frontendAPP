import React, { useEffect, useState } from 'react';
import { Activity, Wind, Droplets, Sun, Loader2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import StatCard from '../components/Statcard';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface DashboardStats {
  respiratory_rate: { value: number; unit: string; status: string; color: string };
  heart_rate: { value: number; unit: string; status: string; color: string };
  spo2: { value: number; unit: string; status: string; color: string };
  air_quality: { value: number; unit: string; status: string; color: string };
  temperature: { value: number; unit: string; status: string; color: string };
}

interface RecentMeasurement {
  label: string;
  value: string;
  color: string;
}

interface HistoryItem {
  date: string;
  status: string;
  color: string;
}

interface DashboardData {
  stats: DashboardStats;
  trends: number[];
  history: HistoryItem[];
  recent_measurements: RecentMeasurement[];
}

function TableauDeBord() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        console.log('Token utilisé:', token);
        const response = await axios.get(`${API_BASE}/health/dashboard/`, {
          headers: { 
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Réponse reçue:', response.data);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 403) {
            setError(`Accès refusé (403): Vérifiez votre authentification. Token valide: ${token ? 'Oui' : 'Non'}`);
          } else if (err.response?.status === 404) {
            setError(`${err.response.data.error || 'Aucune donnée disponible pour votre compte'}`);
          } else if (err.response) {
            setError(`Erreur ${err.response.status}: ${err.response.data.detail || 'Impossible de charger les données'}`);
          } else if (err.request) {
            setError('Aucune réponse reçue du serveur. Vérifiez que le backend est en cours d\'exécution.');
          } else {
            setError(`Erreur: ${err.message}`);
          }
        } else {
          setError('Impossible de charger les données du tableau de bord');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    } else {
      setError('Veuillez vous connecter pour voir vos données');
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Chargement des données...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
        <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
        <div>
          <h3 className="font-semibold mb-1">Erreur</h3>
          <p>{error || "Aucune donnée disponible"}</p>
          <p className="mt-2 text-sm">Veuillez vérifier votre connexion ou contacter le support.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Aperçu du tableau de bord</h1>
        <p className="text-base text-gray-500">Suivez l'évolution de vos indicateurs respiratoires en temps réel</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          icon={Activity}
          value={data.stats.respiratory_rate.value || 0}
          label="Fréquence respiratoire"
          color={data.stats.respiratory_rate.value === 0 ? "#9ca3af" : data.stats.respiratory_rate.color}
          unit={data.stats.respiratory_rate.unit}
          trend={data.stats.respiratory_rate.value === 0 ? "Aucune donnée" : data.stats.respiratory_rate.status}
        />
        <StatCard
          icon={Wind}
          value={data.stats.heart_rate.value || 0}
          label="Fréquence cardiaque"
          color={data.stats.heart_rate.value === 0 ? "#9ca3af" : data.stats.heart_rate.color}
          unit={data.stats.heart_rate.unit}
          trend={data.stats.heart_rate.value === 0 ? "Aucune donnée" : data.stats.heart_rate.status}
        />
        <StatCard
          icon={Droplets}
          value={data.stats.spo2.value || 0}
          label="SpO2"
          color={data.stats.spo2.value === 0 ? "#9ca3af" : data.stats.spo2.color}
          unit={data.stats.spo2.unit}
          trend={data.stats.spo2.value === 0 ? "Aucune donnée" : data.stats.spo2.status}
        />
        <StatCard
          icon={Sun}
          value={data.stats.air_quality.value || 0}
          label="Qualité de l'air"
          color={data.stats.air_quality.value === 0 ? "#9ca3af" : data.stats.air_quality.color}
          unit={data.stats.air_quality.unit}
          trend={data.stats.air_quality.value === 0 ? "Aucune donnée" : data.stats.air_quality.status}
        />
      </div>

      {/* Tendances de santé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Tendances de santé sur 7 jours
          </h3>
          {data.trends.length > 0 ? (
            <div className="flex items-end gap-2 h-48">
              {data.trends.map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all cursor-pointer hover:opacity-80"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">
                    {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg text-gray-500">
              Aucune donnée de tendance disponible
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-5 text-gray-800">
            Mesures récentes
          </h3>
          {data.recent_measurements.length > 0 ? (
            <div className="flex flex-col gap-4">
              {data.recent_measurements.map((item, index) => (
                <div 
                  key={index} 
                  className={`flex justify-between items-center pb-4 ${index < data.recent_measurements.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <span className="text-sm text-gray-500">{item.label}</span>
                  <span className="text-base font-semibold" style={{ color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg text-gray-500">
              Aucune mesure récente disponible
            </div>
          )}
        </div>
      </div>

      {/* Données historiques */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">
          Données historiques
        </h3>
        <div className="flex flex-col gap-3">
          {data.history.length > 0 ? (
            data.history.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-800">Mesure respiratoire</div>
                  <div className="text-xs text-gray-500 mt-1">{item.date}</div>
                </div>
                <div 
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: `${item.color}20`, color: item.color }}
                >
                  {item.status}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              Aucune donnée historique disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableauDeBord;