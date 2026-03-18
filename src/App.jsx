import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 


// Importamos los componentes
import Verificacion from './pages/Verificacion/index';
import Perfil from './pages/Perfil';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard/index';
import Login from './pages/Login/index';
import Register from './pages/Register/index';
import Checkout from './pages/Checkout/index';
import Landing from './pages/Landing';
import Configuracion from './pages/Configuracion';
import Transacciones from './pages/Transacciones';
import Documentacion from './pages/Desarrolladores/index';

function App() {
  return (
    <>
      {/* 2. Colocamos el Toaster aquí. position="top-right" las mostrará arriba a la derecha */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
         <Route path="/verificar" element={<Verificacion />} />
        
        <Route 
          path="/desarrolladores" 
          element={
            <DashboardLayout>
              <Documentacion />
            </DashboardLayout>
          } 
        />


        <Route path="/transacciones" element={
          <DashboardLayout>
            <Transacciones />
          </DashboardLayout>
        } />

        <Route 
          path="/configuracion" 
          element={
            <DashboardLayout>
              <Configuracion />
            </DashboardLayout>
          } 
        />

        <Route path="/perfil" element={
        <DashboardLayout>
          <Perfil />
        </DashboardLayout>
      } />

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