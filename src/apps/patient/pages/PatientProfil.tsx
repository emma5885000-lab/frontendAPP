import React from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendar, FaShieldAlt, FaSignOutAlt, FaChevronRight, FaBell, FaLock, FaQuestionCircle, FaMicrochip } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

function PatientProfil() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const username = user?.username || 'Patient';
  const email = user?.email || 'patient@example.com';
  const initials = username.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleLogout = () => { logout(); navigate('/patient/login'); };

  return (
    <div className="px-4 py-4">
      <div className="p-6 rounded-2xl text-white text-center mb-5" style={{ background: 'linear-gradient(135deg, #024BB9 0%, #01337a 100%)' }}>
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold">{initials}</div>
        <h1 className="text-xl font-bold mb-1">{username}</h1>
        <p className="text-blue-100 text-sm">{email}</p>
        <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm">
          <FaShieldAlt size={14} /><span>Patient verifie</span>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">INFORMATIONS</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <FaEnvelope size={18} className="text-blue-700" />
            <div><div className="text-xs text-gray-400">Email</div><div className="text-sm text-gray-800">{email}</div></div>
          </div>
          <div className="flex items-center gap-3">
            <FaPhone size={18} className="text-emerald-600" />
            <div><div className="text-xs text-gray-400">Telephone</div><div className="text-sm text-gray-800">+237 6XX XXX XXX</div></div>
          </div>
          <div className="flex items-center gap-3">
            <FaCalendar size={18} className="text-blue-700" />
            <div><div className="text-xs text-gray-400">Membre depuis</div><div className="text-sm text-gray-800">Janvier 2025</div></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
        <button onClick={() => {}} className="w-full flex items-center gap-3 p-4 border-b border-gray-100">
          <FaUser size={18} className="text-gray-600" /><span className="flex-1 text-left text-gray-800">Informations personnelles</span><FaChevronRight size={18} className="text-gray-400" />
        </button>
        <button onClick={() => navigate('/patient/devices')} className="w-full flex items-center gap-3 p-4 border-b border-gray-100">
          <FaMicrochip size={18} className="text-emerald-600" /><span className="flex-1 text-left text-gray-800">Mes appareils</span><FaChevronRight size={18} className="text-gray-400" />
        </button>
        <button onClick={() => navigate('/patient/alertes')} className="w-full flex items-center gap-3 p-4 border-b border-gray-100">
          <FaBell size={18} className="text-gray-600" /><span className="flex-1 text-left text-gray-800">Notifications</span><FaChevronRight size={18} className="text-gray-400" />
        </button>
        <button onClick={() => {}} className="w-full flex items-center gap-3 p-4 border-b border-gray-100">
          <FaLock size={18} className="text-gray-600" /><span className="flex-1 text-left text-gray-800">Securite</span><FaChevronRight size={18} className="text-gray-400" />
        </button>
        <button onClick={() => {}} className="w-full flex items-center gap-3 p-4">
          <FaQuestionCircle size={18} className="text-gray-600" /><span className="flex-1 text-left text-gray-800">Aide</span><FaChevronRight size={18} className="text-gray-400" />
        </button>
      </div>
      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-4 bg-blue-50 text-blue-700 rounded-xl font-semibold">
        <FaSignOutAlt size={20} /><span>Se deconnecter</span>
      </button>
      <div className="text-center mt-6 text-xs text-gray-400">HEALTH TIC v1.0.0</div>
    </div>
  );
}

export default PatientProfil;
