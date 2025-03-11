import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Home from "./views/Home";
import Inicio from "./views/Inicio";
import Usuarios from "./views/Usuarios";
import Monitoreo from "./views/Monitoreo";
import MoniInv from "./views/MoniInv";
import Notificaciones from "./views/Notificaciones";

import Navbar from "./components/Navbar";

function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Si la ruta NO es '/', muestra el Navbar */}
      {location.pathname !== "/" && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/Usuarios" element={<Usuarios />} />
        <Route path="/Monitoreo" element={<Monitoreo />} />
        <Route path="/Notificaciones" element={<Notificaciones />} />
        <Route path="/MoniInv" element={<MoniInv />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;