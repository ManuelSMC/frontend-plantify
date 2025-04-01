import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Presentacion from './Presentacion';
import Usuarios from './Usuarios';
import reportWebVitals from './reportWebVitals';
import Monitoreo from "./components/monitoreo/Monitoreo";
import HistorialSensores from "./components/monitoreo/HistorialSensores";
import HistorialNotificaciones from "./components/notificaciones/HistorialNotificaciones";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/presentacion" element={<Presentacion />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/monitoreo" element={<Monitoreo />} />
        <Route path="/historial-sensores" element={<HistorialSensores />} />
        <Route path="/historial-notificaciones" element={<HistorialNotificaciones />} />
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
