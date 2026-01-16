import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Wind,
  Droplets,
  Sun,
  Brain,
  BarChart3,
  Calendar,
  MessageSquare
} from 'lucide-react';
import StatCard from '../components/Statcard';
import { useAuthStore } from '../store/authStore';

function Accueil() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const username = user?.username || "Utilisateur";

  return (
    <div>

      {/* ================= HERO IA ================= */}
      <section className="bg-blue-50 py-20 px-6 rounded-2xl mb-8">
        <div className="max-w-6xl mx-auto flex items-center gap-10 flex-wrap">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 mb-5">
              HEALTH TIC :<br />
              L'IA au service de<br />
              votre santé respiratoire
            </h1>

            <p className="text-base text-gray-600 max-w-lg mb-8">
              Découvrez une nouvelle ère de la prévention et du suivi des maladies
              respiratoires grâce à l'intelligence artificielle.
              <strong> E-Santé 4.0</strong> vous aide à analyser vos données,
              anticiper les risques et recevoir des alertes intelligentes.
            </p>

            <button
              onClick={() => navigate('/prediction')}
              className="bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Démarrer l'analyse IA
            </button>
          </div>

          <div className="flex-1 text-center">
            <img
              src="/healthia.jpg"
              alt="IA santé respiratoire"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Bannière de bienvenue */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl text-white mb-6">
        <h1 className="text-3xl font-bold mb-3">
          Bienvenue {username} 👋
        </h1>
        <p className="text-base opacity-90 mb-6">
          Votre plateforme de suivi et de prévention des maladies respiratoires propulsée par l'IA
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/prediction')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-gray-100 transition-colors"
          >
            Analyse IA
          </button>
          <button
            onClick={() => navigate('/tableau')}
            className="bg-white/20 text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-white/30 transition-colors"
          >
            Voir détails
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard icon={Activity} value="16" label="Fréquence respiratoire" color="#10b981" unit="/min" />
        <StatCard icon={Wind} value="72" label="Fréquence cardiaque" color="#3b82f6" unit=" bpm" />
        <StatCard icon={Droplets} value="98" label="Saturation en oxygène" color="#8b5cf6" unit="%" />
        <StatCard icon={Sun} value="Bonne" label="Qualité de l'air" color="#f59e0b" trend="AQI: 35" />
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Actions rapides
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Analyse IA */}
          <div 
            onClick={() => navigate('/prediction')} 
            className="flex items-center gap-4 p-5 bg-blue-100 rounded-xl cursor-pointer hover:bg-blue-200 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain size={28} className="text-white" />
            </div>
            <div>
              <strong className="text-gray-900">Analyse IA</strong>
              <div className="text-sm text-gray-600">Prédiction des risques respiratoires</div>
            </div>
          </div>

          {/* Tableau */}
          <div 
            onClick={() => navigate('/tableau')} 
            className="flex items-center gap-4 p-5 bg-teal-100 rounded-xl cursor-pointer hover:bg-teal-200 transition-colors"
          >
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
              <BarChart3 size={28} className="text-white" />
            </div>
            <div>
              <strong className="text-gray-900">Tableau de bord</strong>
              <div className="text-sm text-gray-600">Données détaillées</div>
            </div>
          </div>

          {/* Messagerie */}
          <div 
            onClick={() => navigate('/messagerie')} 
            className="flex items-center gap-4 p-5 bg-purple-100 rounded-xl cursor-pointer hover:bg-purple-200 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <MessageSquare size={28} className="text-white" />
            </div>
            <div>
              <strong className="text-gray-900">Messagerie</strong>
              <div className="text-sm text-gray-600">Messages patients</div>
            </div>
          </div>

          {/* Profil */}
          <div 
            onClick={() => navigate('/profil')} 
            className="flex items-center gap-4 p-5 bg-amber-100 rounded-xl cursor-pointer hover:bg-amber-200 transition-colors"
          >
            <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
              <Calendar size={28} className="text-white" />
            </div>
            <div>
              <strong className="text-gray-900">Rendez-vous</strong>
              <div className="text-sm text-gray-600">Consultations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Patients récents */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Patients récents
        </h2>

        {[
          { nom: 'Yasmine', statut: 'Stable', color: 'bg-emerald-500' },
          { nom: 'Ahmed', statut: 'Suivi', color: 'bg-blue-500' },
          { nom: 'Fatou', statut: 'Attention', color: 'bg-amber-500' },
        ].map((p, i) => (
          <div key={i} className="flex items-center p-4 bg-gray-50 rounded-lg mb-3">
            <div className={`w-12 h-12 rounded-full ${p.color} flex items-center justify-center text-white font-bold mr-4`}>
              {p.nom[0]}
            </div>
            <div>
              <strong className="text-gray-900">{p.nom}</strong>
              <div className="text-sm text-gray-600">Statut : {p.statut}</div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Accueil;
