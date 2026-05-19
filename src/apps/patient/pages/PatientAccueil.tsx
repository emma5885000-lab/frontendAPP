import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartbeat, FaWind, FaTint, FaBrain, FaChartBar, FaComments, FaChevronRight, FaThermometerHalf, FaLightbulb, FaRunning, FaAppleAlt, FaCalendarCheck, FaDumbbell, FaSpa, FaHandsWash, FaMask, FaHome, FaLeaf, FaShieldAlt, FaHeart } from 'react-icons/fa';
import { GiLungs, GiMeditation } from 'react-icons/gi';
import { MdAir, MdHealthAndSafety } from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';

const API_BASE = import.meta.env.VITE_API_URL || 'https://backend-eeh7.onrender.com/api';

const getRecommendationIcon = (iconEmoji: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    '🫁': <GiLungs size={18} className="text-sky-600" />,
    '🏃': <FaRunning size={18} className="text-emerald-600" />,
    '🍎': <FaAppleAlt size={18} className="text-red-500" />,
    '📅': <FaCalendarCheck size={18} className="text-sky-600" />,
    '💪': <FaDumbbell size={18} className="text-amber-600" />,
    '🧘': <GiMeditation size={18} className="text-purple-600" />,
    '🌬️': <MdAir size={18} className="text-sky-500" />,
    '💨': <FaWind size={18} className="text-sky-500" />,
    '🏠': <FaHome size={18} className="text-amber-600" />,
    '😷': <FaMask size={18} className="text-gray-600" />,
    '🧼': <FaHandsWash size={18} className="text-sky-500" />,
    '🌿': <FaLeaf size={18} className="text-emerald-600" />,
    '💡': <FaLightbulb size={18} className="text-amber-500" />,
    '❤️': <FaHeart size={18} className="text-red-500" />,
    '🛡️': <FaShieldAlt size={18} className="text-emerald-600" />,
    '🧠': <FaBrain size={18} className="text-purple-600" />,
    '🩺': <MdHealthAndSafety size={18} className="text-sky-600" />,
    '🧘‍♀️': <FaSpa size={18} className="text-purple-500" />,
  };
  return iconMap[iconEmoji] || <FaLightbulb size={18} className="text-sky-600" />;
};

interface DashboardStats {
  respiratory_rate: { value: number; unit: string; status: string };
  heart_rate: { value: number; unit: string; status: string };
  spo2: { value: number; unit: string; status: string };
  temperature: { value: number; unit: string; status: string };
}

interface Recommendation {
  icon: string;
  title: string;
  description: string;
  bgClass: string;
}

function PatientAccueil() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const username = user?.username || "Patient";
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les données du tableau de bord
        const dashboardResponse = await axios.get(`${API_BASE}/health/dashboard/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setStats(dashboardResponse.data.stats);
        
        // Récupérer les recommandations
        const predictionResponse = await axios.get(`${API_BASE}/health/prediction/`, {
          headers: { Authorization: `Token ${token}` }
        });
        setRecommendations(predictionResponse.data.recommendations || []);
      } catch (err) {
        console.error('Erreur chargement données:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
    else setLoading(false);
  }, [token]);

  return (
    <div className="px-4 py-4">
      <div className="p-5 rounded-2xl text-white mb-5" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' }}>
        <h1 className="text-xl font-bold mb-1">Bonjour {username} </h1>
        <p className="text-sm text-sky-100 mb-4">Suivez votre santé respiratoire en temps réel</p>
        <button
          onClick={() => navigate('/patient/prediction')}
          className="bg-white text-sky-600 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2"
        >
          <FaBrain size={18} />
          Analyse IA
        </button>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Vos indicateurs</h2>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-sky-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
              <FaWind size={18} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats?.respiratory_rate?.value || 0}</div>
            <div className="text-xs text-gray-500">Fréq. respiratoire</div>
            <div className="text-xs text-emerald-500 font-medium mt-1">{stats?.respiratory_rate?.status || '--'}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
              <FaHeartbeat size={18} className="text-sky-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats?.heart_rate?.value || 0}</div>
            <div className="text-xs text-gray-500">Fréq. cardiaque</div>
            <div className="text-xs text-sky-500 font-medium mt-1">{stats?.heart_rate?.status || '--'}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
              <FaTint size={18} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats?.spo2?.value || 0}%</div>
            <div className="text-xs text-gray-500">Saturation O₂</div>
            <div className="text-xs text-emerald-500 font-medium mt-1">{stats?.spo2?.status || '--'}</div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
              <FaThermometerHalf size={18} className="text-sky-600" />
            </div>
            <div className="text-2xl font-bold text-gray-800">{stats?.temperature?.value || 0}°C</div>
            <div className="text-xs text-gray-500">Température</div>
            <div className="text-xs text-sky-500 font-medium mt-1">{stats?.temperature?.status || '--'}</div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Actions rapides</h2>
      <div className="space-y-3">
        <button 
          onClick={() => navigate('/patient/prediction')} 
          className="w-full flex items-center gap-4 p-4 bg-sky-50 rounded-xl active:bg-sky-100 transition-colors"
        >
          <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
            <FaBrain size={24} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">Analyse IA</div>
            <div className="text-sm text-gray-500">Prédiction des risques</div>
          </div>
          <FaChevronRight size={20} className="text-gray-400" />
        </button>

        <button 
          onClick={() => navigate('/patient/tableau')} 
          className="w-full flex items-center gap-4 p-4 bg-emerald-50 rounded-xl active:bg-emerald-100 transition-colors"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <FaChartBar size={24} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">Mes données</div>
            <div className="text-sm text-gray-500">Historique complet</div>
          </div>
          <FaChevronRight size={20} className="text-gray-400" />
        </button>

        <button 
          onClick={() => navigate('/patient/messagerie')} 
          className="w-full flex items-center gap-4 p-4 bg-sky-50 rounded-xl active:bg-sky-100 transition-colors"
        >
          <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
            <FaComments size={24} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">Messagerie</div>
            <div className="text-sm text-gray-500">Contacter mon médecin</div>
          </div>
          <FaChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recommandations</h2>
          {recommendations.slice(0, 1).map((rec, index) => (
            <div key={index} className="p-4 rounded-xl bg-white">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-sky-50 rounded-lg flex items-center justify-center">
                  {getRecommendationIcon(rec.icon)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-1">{rec.title}</div>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientAccueil;
