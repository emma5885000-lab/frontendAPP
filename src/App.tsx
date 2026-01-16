import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Accueil from './pages/Accueil';
import TableauDeBord from './pages/TableauDeBord';
import PredictionIA from './pages/PredictionIA';
import Profil from './pages/Profil';
import Alertes from './pages/Alertes';
import Messagerie from './pages/Messagerie';
import AuthForm from './components/AuthForm';
import { useAuthStore } from './store/authStore';





function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated); // utilise le store Zustand

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {isAuthenticated && <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />}
        <div className="flex-1 flex flex-col overflow-hidden">
          {isAuthenticated && <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
          <div className="flex-1 overflow-y-auto p-6">
            <Routes>
              {/* Routes publiques */}
              <Route path="/login" element={<AuthForm />} />
              <Route path="/register" element={<AuthForm register />} />

              {/* Routes protégées */}
              <Route path="/" element={isAuthenticated ? <Accueil /> : <Navigate to="/login" />} />
              <Route path="/tableau" element={isAuthenticated ? <TableauDeBord /> : <Navigate to="/login" />} />
              <Route path="/prediction" element={isAuthenticated ? <PredictionIA /> : <Navigate to="/login" />} />
              <Route path="/profil" element={isAuthenticated ? <Profil /> : <Navigate to="/login" />} />
              <Route path="/alertes" element={isAuthenticated ? <Alertes /> : <Navigate to="/login" />} />
              <Route path="/messagerie" element={isAuthenticated ? <Messagerie /> : <Navigate to="/login" />} />


              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
