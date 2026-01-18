import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Composants médecin (web) - existants
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Accueil from './pages/Accueil';
import TableauDeBord from './pages/TableauDeBord';
import PredictionIA from './pages/PredictionIA';
import Profil from './pages/Profil';
import Alertes from './pages/Alertes';
import Messagerie from './pages/Messagerie';
import AuthForm from './components/AuthForm';

// Composants patient (mobile PWA)
import PatientMobileLayout from './apps/patient/layouts/PatientMobileLayout';
import PatientAccueil from './apps/patient/pages/PatientAccueil';
import PatientTableau from './apps/patient/pages/PatientTableau';
import PatientPrediction from './apps/patient/pages/PatientPrediction';
import PatientProfil from './apps/patient/pages/PatientProfil';
import PatientAlertes from './apps/patient/pages/PatientAlertes';
import PatientMessagerie from './apps/patient/pages/PatientMessagerie';
import PatientAuth from './apps/patient/pages/PatientAuth';

import { useAuthStore } from './store/authStore';

// Layout pour l'espace médecin (web desktop)
function MedecinWebLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Composant de protection des routes
function ProtectedRoute({ children, redirectTo }: { children: React.ReactNode; redirectTo: string }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to={redirectTo} replace />;
}

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <Router>
      <Routes>
        {/* ============ ROUTES PATIENT (Mobile PWA) ============ */}
        <Route path="/patient/login" element={<PatientAuth />} />
        <Route path="/patient/register" element={<PatientAuth register />} />
        
        {/* Routes patient protégées avec layout mobile */}
        <Route path="/patient" element={
          isAuthenticated ? <PatientMobileLayout /> : <Navigate to="/patient/login" replace />
        }>
          <Route index element={<PatientAccueil />} />
          <Route path="tableau" element={<PatientTableau />} />
          <Route path="prediction" element={<PatientPrediction />} />
          <Route path="profil" element={<PatientProfil />} />
          <Route path="alertes" element={<PatientAlertes />} />
          <Route path="messagerie" element={<PatientMessagerie />} />
        </Route>

        {/* ============ ROUTES MÉDECIN (Web Desktop) ============ */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <AuthForm />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/" replace /> : <AuthForm />
        } />
        
        {/* Routes médecin protégées avec layout web */}
        <Route path="/" element={
          isAuthenticated ? <MedecinWebLayout /> : <Navigate to="/login" replace />
        }>
          <Route index element={<Accueil />} />
          <Route path="tableau" element={<TableauDeBord />} />
          <Route path="prediction" element={<PredictionIA />} />
          <Route path="profil" element={<Profil />} />
          <Route path="alertes" element={<Alertes />} />
          <Route path="messagerie" element={<Messagerie />} />
        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
