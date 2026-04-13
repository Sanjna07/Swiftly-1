import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'PLACEHOLDER'}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
