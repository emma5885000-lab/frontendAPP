import React from 'react';
import { Outlet } from 'react-router-dom';
import MobileNavbar from '../components/MobileNavbar';
import MobileHeader from '../components/MobileHeader';

function PatientMobileLayout() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header mobile fixe en haut */}
      <MobileHeader />
      
      {/* Contenu principal avec scroll */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      
      {/* Navigation mobile fixe en bas */}
      <MobileNavbar />
    </div>
  );
}

export default PatientMobileLayout;
