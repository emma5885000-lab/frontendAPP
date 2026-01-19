import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaChartBar, FaBrain, FaComments, FaUser } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface NavItem {
  path: string;
  icon: IconType;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/patient', icon: FaHome, label: 'Accueil' },
  { path: '/patient/tableau', icon: FaChartBar, label: 'Données' },
  { path: '/patient/prediction', icon: FaBrain, label: 'IA' },
  { path: '/patient/messagerie', icon: FaComments, label: 'Messages' },
  { path: '/patient/profil', icon: FaUser, label: 'Profil' },
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
                    ? 'text-blue-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-blue-100' : ''}`}>
                    <Icon size={22} />
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
