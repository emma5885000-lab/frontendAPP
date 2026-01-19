import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, Clock, Filter } from 'lucide-react';

interface Alerte {
  id: number;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockAlertes: Alerte[] = [
  {
    id: 1,
    type: 'warning',
    title: 'SpO2 faible détectée',
    message: 'Votre saturation en oxygène est descendue à 94%. Consultez votre médecin si cela persiste.',
    time: 'Il y a 2h',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Rappel de mesure',
    message: 'N\'oubliez pas de prendre vos mesures quotidiennes.',
    time: 'Il y a 5h',
    read: false
  },
  {
    id: 3,
    type: 'success',
    title: 'Analyse IA terminée',
    message: 'Votre dernière analyse IA est disponible. Risque faible détecté.',
    time: 'Hier',
    read: true
  },
  {
    id: 4,
    type: 'info',
    title: 'Message de votre médecin',
    message: 'Dr. Martin vous a envoyé un nouveau message.',
    time: 'Hier',
    read: true
  }
];

function PatientAlertes() {
  const [alertes, setAlertes] = useState<Alerte[]>(mockAlertes);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredAlertes = filter === 'unread' 
    ? alertes.filter(a => !a.read) 
    : alertes;

  const unreadCount = alertes.filter(a => !a.read).length;

  const markAsRead = (id: number) => {
    setAlertes(prev => prev.map(a => 
      a.id === id ? { ...a, read: true } : a
    ));
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle size={20} className="text-sky-500" />;
      case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
      default: return <Info size={20} className="text-sky-500" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch(type) {
      case 'warning': return 'border-l-sky-500 bg-sky-50';
      case 'success': return 'border-l-emerald-500 bg-emerald-50';
      default: return 'border-l-sky-500 bg-sky-50';
    }
  };

  return (
    <div className="px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Alertes</h1>
          <p className="text-sm text-gray-500">{unreadCount} non lue(s)</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === 'all' ? 'unread' : 'all')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread' 
                ? 'bg-sky-100 text-sky-600' 
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Filter size={16} />
            {filter === 'unread' ? 'Non lues' : 'Toutes'}
          </button>
        </div>
      </div>

      {/* Liste des alertes */}
      {filteredAlertes.length > 0 ? (
        <div className="space-y-3">
          {filteredAlertes.map((alerte) => (
            <div
              key={alerte.id}
              onClick={() => markAsRead(alerte.id)}
              className={`p-4 rounded-xl border-l-4 ${getAlertStyle(alerte.type)} ${
                !alerte.read ? 'shadow-sm' : 'opacity-70'
              } active:opacity-80 transition-opacity cursor-pointer`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getAlertIcon(alerte.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-800">{alerte.title}</span>
                    {!alerte.read && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{alerte.message}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{alerte.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-500">Aucune alerte</p>
        </div>
      )}
    </div>
  );
}

export default PatientAlertes;
