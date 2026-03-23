import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- ¡El enrutador que nos faltaba!
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';



// Usamos UN SOLO createRoot, y ordenamos los "escudos" correctamente
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="758151472142-ej6ncaq5nio8l2mjf8hobmrrmbbb7buc.apps.googleusercontent.com">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)