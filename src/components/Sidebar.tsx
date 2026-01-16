import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart3, Brain, User, Bell, MessageSquare, LucideIcon } from 'lucide-react';

interface MenuItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

interface SidebarProps {
  isOpen: boolean;
}

const menuItems: MenuItem[] = [
  { path: '/', icon: Home, label: 'Accueil' },
  { path: '/tableau', icon: BarChart3, label: 'Tableau de bord' },
  { path: '/prediction', icon: Brain, label: 'Prédiction IA' },
  { path: '/profil', icon: User, label: 'Profil' },
  { path: '/alertes', icon: Bell, label: 'Alertes' },
  { path: '/messagerie', icon: MessageSquare, label: 'Messagerie' },
];

function Sidebar({ isOpen }: SidebarProps) {
  return (
    <div className={`w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${!isOpen ? '-translate-x-64 absolute md:relative' : ''}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-800 rounded-xl flex items-center justify-center text-white font-bold text-xl">H</div>
          <div className="text-xl font-bold text-blue-900">HEALTH TIC</div>
        </div>
      </div>

      <nav className="p-4 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-100 text-blue-600 font-medium' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`
              }
              end={item.path === '/'}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;