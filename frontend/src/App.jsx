import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/* Pages */
import DashboardPage from './pages/DashboardPage';
import MedicamentsPage from './pages/MedicamentsPage';
import VentesPage from './pages/VentesPage';

/* Layout */
import Layout from './components/layout/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wrapper encapsulant les pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="medicaments" element={<MedicamentsPage />} />
          <Route path="ventes" element={<VentesPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
