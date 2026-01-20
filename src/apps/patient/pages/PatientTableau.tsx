import React, { useEffect, useState } from 'react';
import { FaHeartbeat, FaWind, FaTint, FaSun, FaThermometerHalf } from 'react-icons/fa';
import { AiOutlineLoading3Quarters, AiOutlineWarning } from 'react-icons/ai';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

interface DashboardStats {
  respiratory_rate: { value: number; unit: string; status: string; color: string };
  heart_rate: { value: number; unit: string; status: string; color: string };
  spo2: { value: number; unit: string; status: string; color: string };
  air_quality: { value: number; unit: string; status: string; color: string };
  temperature: { value: number; unit: string; status: string; color: string };
}

interface DashboardData {
  stats: DashboardStats;
  trends: number[];
  history: { date: string; status: string; color: string }[];
  recent_measurements: { label: string; value: string; color: string }[];
}

function PatientTableau() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/health/dashboard/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
        setError('Impossible de charger vos données');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchDashboard();
    else {
      setError('Veuillez vous connecter');
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-sky-500 mb-3" />
        <span className="text-gray-500 text-sm">Chargement...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-4 my-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-center gap-3 text-red-700">
          <AiOutlineWarning size={20} />
          <span className="text-sm">{error || "Aucune donnée"}</span>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      icon: FaWind, 
      label: 'Fréq. respiratoire', 
      value: data.stats.respiratory_rate.value,
      unit: data.stats.respiratory_rate.unit,
      status: data.stats.respiratory_rate.status,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    { 
      icon: FaHeartbeat, 
      label: 'Fréq. cardiaque', 
      value: data.stats.heart_rate.value,
      unit: data.stats.heart_rate.unit,
      status: data.stats.heart_rate.status,
      color: 'sky',
      bgColor: 'bg-sky-100',
      iconColor: 'text-sky-600'
    },
    { 
      icon: FaTint, 
      label: 'Saturation O₂', 
      value: data.stats.spo2.value,
      unit: data.stats.spo2.unit,
      status: data.stats.spo2.status,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    { 
      icon: FaThermometerHalf, 
      label: 'Température', 
      value: data.stats.temperature.value,
      unit: data.stats.temperature.unit,
      status: data.stats.temperature.status,
      color: 'amber',
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600'
    },
    { 
      icon: FaSun, 
      label: 'Qualité de l\'air', 
      value: data.stats.air_quality.value,
      unit: data.stats.air_quality.unit,
      status: data.stats.air_quality.status,
      color: 'sky',
      bgColor: 'bg-sky-100',
      iconColor: 'text-sky-600'
    },
  ];

  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Mes données</h1>
      <p className="text-sm text-gray-500 mb-4">Suivi en temps réel</p>

      {/* Statistiques */}
      <div className="space-y-3 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <Icon size={24} className={stat.iconColor} />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">{stat.label}</div>
                <div className="text-xl font-bold text-gray-800">
                  {stat.value}{stat.unit}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                stat.status === 'Normal' || stat.status === 'Bon' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : stat.status === 'Attention'
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {stat.status || 'N/A'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tendances */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Tendances (7 jours)</h2>
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
        {data.trends.length > 0 ? (
          <div className="flex items-end gap-2 h-32">
            {data.trends.map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t-lg"
                  style={{ height: `${height}%`, background: 'linear-gradient(0deg, #0ea5e9 0%, #34d399 100%)' }}
                ></div>
                <div className="text-xs text-gray-400 mt-2">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'][index]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8 text-sm">
            Pas de données de tendance
          </div>
        )}
      </div>

      {/* Historique récent */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Historique récent</h2>
      <div className="space-y-2">
        {data.history.length > 0 ? (
          data.history.slice(0, 5).map((item, index) => (
            <div key={index} className="bg-white p-3 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800">Mesure respiratoire</div>
                <div className="text-xs text-gray-400">{item.date}</div>
              </div>
              <div 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: `${item.color}20`, color: item.color }}
              >
                {item.status}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-xl text-center text-gray-400 text-sm">
            Aucun historique disponible
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientTableau;
