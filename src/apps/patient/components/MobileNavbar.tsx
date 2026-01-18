import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Brain, MessageSquare, User, LucideIcon } from 'lucide-react';

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/patient', icon: Home, label: 'Accueil' },
  { path: '/patient/tableau', icon: BarChart3, label: 'Données' },
  { path: '/patient/prediction', icon: Brain, label: 'IA' },
  { path: '/patient/messagerie', icon: MessageSquare, label: 'Messages' },
  { path: '/patient/profil', icon: User, label: 'Profil' },
];

function MobileNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom z-50">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/patient'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-blue-100' : ''}`}>
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNavbar;
