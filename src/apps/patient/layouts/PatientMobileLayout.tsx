import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileNavbar, { BOTTOM_NAV_HEIGHT } from '../components/MobileNavbar';
import MobileHeader from '../components/MobileHeader';

function PatientMobileLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header mobile fixe en haut */}
      <MobileHeader />
      
      {/* Contenu principal avec scroll - padding bottom dynamique pour la nav */}
      <main 
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: `calc(${BOTTOM_NAV_HEIGHT}px + env(safe-area-inset-bottom))` }}
      >
        <Outlet />
      </main>
      
      {/* Navigation mobile fixe en bas */}
      <MobileNavbar />
    </div>
  );
}

export default PatientMobileLayout;
