import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Wind, Droplets, Brain, BarChart3, MessageSquare, Bell, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';

function PatientAccueil() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const username = user?.username || "Patient";

  return (
    <div className="px-4 py-4">
      <div className="bg-gradient-to-br from-sky-400 to-sky-600 p-5 rounded-2xl text-white mb-5">
        <h1 className="text-xl font-bold mb-1">Bonjour {username} 👋</h1>
        <p className="text-sm text-sky-100 mb-4">Suivez votre santé respiratoire en temps réel</p>
        <button
          onClick={() => navigate('/patient/prediction')}
          className="bg-white text-sky-600 px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2"
        >
          <Brain size={18} />
          Analyse IA
        </button>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Vos indicateurs</h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
            <Activity size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">16</div>
          <div className="text-xs text-gray-500">Fréq. respiratoire</div>
          <div className="text-xs text-emerald-500 font-medium mt-1">Normal</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
            <Wind size={18} className="text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">72</div>
          <div className="text-xs text-gray-500">Fréq. cardiaque</div>
          <div className="text-xs text-sky-500 font-medium mt-1">bpm</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mb-2">
            <Droplets size={18} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">98%</div>
          <div className="text-xs text-gray-500">SpO2</div>
          <div className="text-xs text-emerald-500 font-medium mt-1">Excellent</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mb-2">
            <Bell size={18} className="text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-gray-800">2</div>
          <div className="text-xs text-gray-500">Alertes</div>
          <div className="text-xs text-sky-500 font-medium mt-1">À consulter</div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-3">Actions rapides</h2>
      <div className="space-y-3">
        <button 
          onClick={() => navigate('/patient/prediction')} 
          className="w-full flex items-center gap-4 p-4 bg-sky-50 rounded-xl active:bg-sky-100 transition-colors"
        >
          <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">Analyse IA</div>
            <div className="text-sm text-gray-500">Prédiction des risques</div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        <button 
          onClick={() => navigate('/patient/tableau')} 
          className="w-full flex items-center gap-4 p-4 bg-emerald-50 rounded-xl active:bg-emerald-100 transition-colors"
        >
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
            <BarChart3 size={24} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">Mes données</div>
            <div className="text-sm text-gray-500">Historique complet</div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>

        <button 
          onClick={() => navigate('/patient/messagerie')} 
          className="w-full flex items-center gap-4 p-4 bg-sky-50 rounded-xl active:bg-sky-100 transition-colors"
        >
          <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center">
            <MessageSquare size={24} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <div className="font-semibold text-gray-800">Messagerie</div>
            <div className="text-sm text-gray-500">Contacter mon médecin</div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      <div className="mt-5 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
        <div className="text-sm font-semibold text-emerald-700 mb-1">💡 Conseil du jour</div>
        <p className="text-sm text-emerald-600">
          Pensez à pratiquer des exercices de respiration profonde pendant 5 minutes chaque matin.
        </p>
      </div>
    </div>
  );
}

export default PatientAccueil;
