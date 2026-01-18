import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Activity, MessageCircle, User, Bell } from 'lucide-react';

const navItems = [
  { to: '/patient', icon: Home, label: 'Accueil' },
  { to: '/patient/sante', icon: Activity, label: 'Santé' },
  { to: '/patient/alertes', icon: Bell, label: 'Alertes' },
  { to: '/patient/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/patient/profil', icon: User, label: 'Profil' },
];

const PatientBottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/patient'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : ''}`}
                />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default PatientBottomNav;
