import React from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

function MobileHeader() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const username = user?.username || "Patient";

  const initials = username
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 text-white px-4 py-3 safe-area-top" style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%)' }}>
      <div className="flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">
            H
          </div>
          <div>
            <div className="font-bold text-lg">HEALTH TIC</div>
            <div className="text-xs text-sky-100">Votre santé connectée</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/patient/alertes')}
            className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <FaBell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
          </button>
          
          <button 
            onClick={() => navigate('/patient/profil')}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm"
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  );
}

export default MobileHeader;
