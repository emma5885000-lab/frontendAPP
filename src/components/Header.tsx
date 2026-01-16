import React from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface HeaderProps {
  toggleSidebar: () => void;
}

const pagesTitles: Record<string, string> = {
  '/': 'Accueil',
  '/tableau': 'Tableau de bord',
  '/prediction': 'Prédiction IA',
  '/profil': 'Profil',
  '/alertes': 'Alertes',
  '/messagerie': 'Messagerie',
};

function Header({ toggleSidebar }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();


  // 🔺 Infos utilisateur depuis le store Zustand
  const user = useAuthStore(state => state.user);
  const zustandLogout = useAuthStore(state => state.logout);
  
  const username = user?.username || "Utilisateur";
  const role = user?.role || "";

  const initials = username
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  /* ================== DÉCONNEXION ================== */
  const handleLogout = () => {
    // Utiliser la fonction logout du store Zustand
    zustandLogout();
    
    // Redirection vers login
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* ===== GAUCHE ===== */}
      <div className="flex items-center gap-4">
        <button 
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggleSidebar}
        >
        </button>
      </div>

      {/* ===== DROITE ===== */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Utilisateur */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-sm font-semibold text-gray-900">{username}</div>
            <div className="text-xs text-gray-500">{role}</div>
          </div>

          {/* ===== AVATAR (CLIQUABLE POUR LOGOUT) ===== */}
          <div
            className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold cursor-pointer"
            onClick={handleLogout}
            title="Se déconnecter"
          >
            {initials}
          </div>

          {/* Icône logout */}
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
