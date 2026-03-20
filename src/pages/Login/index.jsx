import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para bloquear el botón mientras el backend piensa
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => { // La función ahora es asíncrona
    e.preventDefault();

    // 1. Validaciones básicas del frontend
    if (!email || !password) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    // 2. Conexión real con tu Backend
    setIsLoggingIn(true);
    const toastId = toast.loading('Verificando credenciales...');

    try {
      // Hacemos la petición POST a la ruta de login de tu API
      const response = await fetch('https://lumina-backend-3pu1.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      // Si el servidor nos devuelve un error (ej. contraseña incorrecta)
      if (!response.ok) {
        toast.error(data.error || 'Error al iniciar sesión', { id: toastId });
        setIsLoggingIn(false);
        return;
      }

      // Si las credenciales son correctas, el backend nos da luz verde
      toast.success(`¡Bienvenido de vuelta, ${data.comercio.nombre}!`, { id: toastId });
      
      // Opcional por ahora, pero vital a futuro: Guardar el ID del comercio en el navegador
      localStorage.setItem('comercioId', data.comercio.id);
      localStorage.setItem('comercioNombre', data.comercio.nombre);
      localStorage.setItem('token', data.token);

      navigate('/dashboard');

    } catch (error) {
      console.error(error);
      toast.error('Error de conexión con el servidor. Verifica que esté encendido.', { id: toastId });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Lumi<span className="text-blue-600">na</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión para gestionar tus cobros
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <input
                type="email"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="admin@mitienda.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                type="password"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="text-right mt-2">
            <Link to="/recuperar" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${isLoggingIn ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoggingIn ? 'Entrando...' : 'Entrar al Panel'}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            ¿Tu tienda aún no usa Lumina?{' '}
            <button 
              type="button"
              onClick={() => navigate('/registro')}
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Regístrate aquí
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}