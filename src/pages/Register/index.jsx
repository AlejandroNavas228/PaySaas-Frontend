import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const [comercio, setComercio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Agregamos un estado para bloquear el botón mientras el servidor responde
  const [isRegistering, setIsRegistering] = useState(false); 

  const navigate = useNavigate();

  const handleSubmit = async (e) => { // Agregamos 'async' porque la petición toma tiempo
    e.preventDefault();
    
    // --- VALIDACIONES FRONTEND ---
    if (!comercio || !email || !password || !confirmPassword) {
      toast.error('Por favor, completa todos los campos.');
      return;
    }
    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden. Intenta de nuevo.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Ingresa un correo electrónico válido.');
      return;
    }

    // --- CONEXIÓN AL BACKEND ---
    setIsRegistering(true);
    const toastId = toast.loading('Creando tu cuenta...');

    try {
      // Usamos fetch para enviar los datos al puerto 3000 (tu servidor Node.js)
      const response = await fetch('https://lumina-backend-3pu1.onrender.com/api/registro', {
        method: 'POST', // Método para enviar datos
        headers: {
          'Content-Type': 'application/json', // Le decimos que enviamos un JSON
        },
        body: JSON.stringify({
          comercio: comercio,
          email: email,
          password: password
        })
      });

      // Convertimos la respuesta del servidor a formato JSON
      const data = await response.json();

      // Si el servidor responde con un error (ej. el correo ya existe)
      if (!response.ok) {
        toast.error(data.error || 'Hubo un error al registrar', { id: toastId });
        setIsRegistering(false);
        return;
      }

      // Si todo sale bien, mostramos el éxito y navegamos
      toast.success(`¡Cuenta creada para ${data.comercio.nombre}!`, { id: toastId });
      navigate('/dashboard');

    } catch (error) {
      // Si el servidor está apagado o hay un error de red
      console.error(error);
      toast.error('Error de conexión con el servidor.', { id: toastId });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
        
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Únete a Lumi<span className="text-blue-600">na</span>  y empieza a cobrar
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre de la Tienda</label>
              <input
                type="text"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ej. Mi Tienda Online"
                value={comercio}
                onChange={(e) => setComercio(e.target.value)}
              />
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
              <input
                type="password"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={isRegistering}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${isRegistering ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isRegistering ? 'Procesando...' : 'Registrar mi negocio'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">¿Ya tienes una cuenta? </span>
          <button 
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Inicia sesión aquí
          </button>
        </div>
        
      </div>
    </div>
  );
}