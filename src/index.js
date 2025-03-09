import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Presentacion from './Presentacion';
import Usuarios from './Usuarios'; // Importa Usuarios.js
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Esta ruta carga el componente App */}
        <Route path="/presentacion" element={<Presentacion />} /> {/* Esta ruta carga Presentacion */}
        <Route path="/usuarios" element={<Usuarios />} /> {/* Ruta de usuarios */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
