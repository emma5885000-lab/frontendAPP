import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, Loader2, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

interface Alert {
  id: number;
  title: string;
  message: string;
  level: string;
  is_read: boolean;
  created_at: string;
}

function Alertes() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertCount, setAlertCount] = useState(0);
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!token) {
        setError("Veuillez vous connecter pour voir vos alertes");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE}/alerts/alerts/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // Gérer les valeurs null - renvoyer tableau vide si null
        const alertsData = response.data || [];
        setAlerts(alertsData);
        setAlertCount(alertsData.length || 0);
        setError(null);
      } catch (err) {
        console.error("Erreur récupération alertes:", err);
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 403) {
            setError("Accès refusé. Vérifiez votre authentification.");
          } else if (err.response?.status === 404) {
            setAlerts([]);
            setAlertCount(0);
            setError(null);
          } else {
            setError(`Erreur: ${err.response?.data?.detail || 'Impossible de charger les alertes'}`);
          }
        } else {
          setError("Impossible de charger les alertes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [token]);

  const getColorClasses = (level: string | null) => {
    switch(level || 'info') {
      case "danger": return { bg: "bg-red-100", text: "text-red-700", iconBg: "bg-red-400" };
      case "warning": return { bg: "bg-amber-100", text: "text-amber-800", iconBg: "bg-amber-400" };
      default: return { bg: "bg-blue-100", text: "text-blue-800", iconBg: "bg-blue-500" };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Chargement des alertes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center">
        <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
        <div>
          <h3 className="font-semibold mb-1">Erreur</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Alertes</h1>
        <p className="text-base text-gray-500">
          Vous avez <span className="font-semibold text-blue-600">{alertCount}</span> alerte(s)
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-gray-100 text-gray-600 p-6 rounded-xl text-center">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-lg font-medium">Aucune alerte pour le moment</p>
          <p className="text-sm mt-1">Vous serez notifié en cas de problème de santé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {alerts.map(alert => {
            const colors = getColorClasses(alert.level);
            return (
              <div 
                key={alert.id || 0} 
                className={`flex flex-col ${colors.bg} ${colors.text} p-5 rounded-xl shadow-sm cursor-pointer transition-transform hover:scale-[1.02] relative ${!alert.is_read ? 'border-l-4 border-blue-500' : ''}`}
              >
                {!alert.is_read && (
                  <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
                <div className="flex items-center mb-3">
                  <div className={`w-10 h-10 rounded-lg ${colors.iconBg} flex items-center justify-center mr-3`}>
                    <Bell size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{alert.title || "Sans titre"}</h3>
                    {!alert.is_read && <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Nouvelle</span>}
                  </div>
                </div>
                <p className="text-sm mb-3">{alert.message || "Aucun message"}</p>
                <small className="opacity-80">
                  Créée le: {alert.created_at ? new Date(alert.created_at).toLocaleString() : "Date inconnue"}
                </small>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Alertes;
