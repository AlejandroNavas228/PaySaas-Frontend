import { GoogleLogin } from '@react-oauth/google';
import React, { useState, useEffect, useRef} from 'react';
import { Github } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LogoLumina from '../../components/ui/LogoLumina';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para bloquear el botón mientras el backend piensa
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Creamos una bandera para saber si ya pedimos los datos
  const githubIntentado = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // Solo ejecutamos si hay código Y si no lo hemos intentado antes
    if (code && !githubIntentado.current) {
      githubIntentado.current = true; // Bajamos la bandera para que no se repita

      // Limpiamos la URL para que se vea profesional (quitamos el ?code=...)
      window.history.replaceState({}, document.title, window.location.pathname);

      const autenticarConGithub = async () => {
        setIsLoggingIn(true);
        const toastId = toast.loading('Conectando con GitHub...');

        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login/github`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          });
          
          const data = await response.json();

          if (response.ok) {
            toast.success(`¡Bienvenido a Lumina, ${data.comercio.nombre}!`, { id: toastId });
            localStorage.setItem('comercioId', data.comercio.id);
            localStorage.setItem('comercioNombre', data.comercio.nombre);
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
          } else {
            toast.error(data.error || 'Error con GitHub', { id: toastId });
            setIsLoggingIn(false);
          }
        } catch (error) {
          console.error('Error en autenticación con GitHub:', error);
          toast.error('Error de conexión con el servidor', { id: toastId });
          setIsLoggingIn(false);
        }
      };

      autenticarConGithub();
    }
  }, []);
  const navigate = useNavigate();

  const handleSubmit = async (e) => { 
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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
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
          <div className="flex justify-center">
            {/* Como el fondo es blanco, le pasamos una clase para que el texto sea oscuro */}
            <LogoLumina width={48} height={48} textColor="text-slate-900" className="scale-125 mb-4" />
          </div>
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

        {/* --- LÍNEA DIVISORIA --- */}
          <div className="mt-6 grid grid-cols-3 items-center text-slate-400">
            <hr className="border-slate-200" />
            <p className="text-center text-sm font-semibold">O continúa con</p>
            <hr className="border-slate-200" />
          </div>

          {/* --- BOTÓN DE GOOGLE --- */}
          <div className="mt-6 flex justify-center">
    <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                // Enviamos el token de Google a nuestro backend
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login/google`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token: credentialResponse.credential })
                });
                
                const data = await response.json();

                if (response.ok) {
                  // 1. Mostramos el mensaje de éxito
                  toast.success(`¡Bienvenido a Lumina, ${data.comercio.nombre}!`);
                  
                  // 2. ¡LA CLAVE! Guardamos los 3 datos exactos que necesita tu Dashboard
                  localStorage.setItem('comercioId', data.comercio.id);
                  localStorage.setItem('comercioNombre', data.comercio.nombre);
                  localStorage.setItem('token', data.token);
                  
                  // 3. Redirección forzada e infalible
                  window.location.href = '/dashboard'; 
                  
                } else {
                  toast.error(data.error || 'Error al iniciar sesión con Google');
                }
              } catch (error) {
                console.error('Error en el login con Google:', error);
                toast.error('Error conectando con el servidor');
              }
            }}
            onError={() => {
              toast.error('Ocurrió un error con la ventana de Google');
            }}
            theme="outline"
            size="large"
            shape="pill"
          />
          </div>

          {/* --- BOTÓN DE GITHUB --- */}
          <button
            type="button"
            onClick={() => {
              // Pon TU Client ID público de GitHub aquí abajo
              const GITHUB_CLIENT_ID = "Ov23li3MwyqIDeyqXKp9"; 
              window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&scope=user:email`;
            }}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#24292F] text-white py-3 rounded-xl font-bold hover:bg-[#1b1f23] transition-all"
          >
            <Github size={20} />
            Continuar con GitHub
          </button>
        
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