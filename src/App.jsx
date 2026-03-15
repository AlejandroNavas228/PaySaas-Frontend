import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 1. Importamos la herramienta de notificaciones

// Importamos los componentes
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard/index';
import Login from './pages/Login/index';
import Register from './pages/Register/index';
import Checkout from './pages/Checkout/index';

function App() {
  return (
    <>
      {/* 2. Colocamos el Toaster aquí. position="top-right" las mostrará arriba a la derecha */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route 
          path="/dashboard" 
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } 
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;