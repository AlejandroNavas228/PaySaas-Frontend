const API_URL = import.meta.env.VITE_API_URL;

// 1. EL MOTOR PRINCIPAL: Esta función envuelve a 'fetch'
async function fetchAPI(endpoint, options = {}) {
  // Siempre busca el token más reciente
  const token = localStorage.getItem('token');

  // Arma los headers automáticamente
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers, // Permite sobreescribir headers si es necesario
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 🛡️ GUARDIÁN GLOBAL: Si cualquier petición da 401 (No autorizado), expulsa al usuario
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('comercioId');
    window.location.href = '/login'; // Redirige al login de inmediato
    throw new Error('Sesión expirada o inválida');
  }

  // Parseamos el JSON
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  // Manejo de errores global
  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    throw new Error(error);
  }

  return data;
}

// 2. EL CATÁLOGO DE FUNCIONES: Exportamos métodos limpios
export const api = {
  // --- COMERCIO Y PERFIL ---
  obtenerComercio: (id) => fetchAPI(`/api/comercio/${id}`),
  
  actualizarPerfil: (id, datos) => fetchAPI(`/api/comercio/${id}/perfil`, { 
    method: 'PUT', 
    body: JSON.stringify(datos) 
  }),
  
  actualizarConfiguracion: (id, datos) => fetchAPI(`/api/comercio/${id}/config`, { 
    method: 'PUT', 
    body: JSON.stringify(datos) 
  }),

  probarWebhook: (id, webhookUrl) => fetchAPI(`/api/comercio/${id}/probar-webhook`, {
    method: 'POST',
    body: JSON.stringify({ webhookUrl })
  }),

  // --- TRANSACCIONES ---
  obtenerTransacciones: (id) => fetchAPI(`/api/pagos/${id}`),
  
  actualizarEstadoPago: (id, estado) => fetchAPI(`/api/pagos/${id}/estado`, { 
    method: 'PUT', 
    body: JSON.stringify({ estado }) 
  }),

  // --- CHECKOUT Y LINKS ---
  generarLink: (apiKey, datos) => fetchAPI(`/api/checkout`, {
    method: 'POST',
    headers: { 'x-api-key': apiKey }, // Aquí usamos api key en vez de token
    body: JSON.stringify(datos)
  }),
  
  // (Opcional: Si en el futuro necesitas llamar suscripciones)
  generarSuscripcion: (plan) => fetchAPI(`/api/suscripcion/generar`, {
    method: 'POST',
    body: JSON.stringify({ plan })
  })
};