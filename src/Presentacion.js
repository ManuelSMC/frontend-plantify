// src/components/Presentacion.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"; // Importar el Navbar
import "./App.css";
import logo from "./assets/logo.png";

function Presentacion() {
  const navigate = useNavigate();

  // Validar autenticación al cargar el componente
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/"); // Redirigir al login si no hay usuario
    }
  }, [navigate]);

  return (
    <div>
      <Navbar /> {/* Llamar al componente Navbar */}
      <div className="container presentacion">
        <div className="texto">
          <h2>¿Quiénes somos?</h2>
          <p>
            Somos una empresa innovadora dedicada al monitoreo inteligente de cultivos mediante sensores avanzados. 
            Especializados en la medición de temperatura y humedad en girasoles, ofrecemos datos precisos en tiempo real para optimizar 
            el crecimiento y la salud de los cultivos. Además, nuestro sistema analiza las condiciones ambientales para identificar posibles 
            riesgos de plagas, como pulgones, permitiendo una respuesta temprana y efectiva. Con tecnología de vanguardia y un enfoque sostenible, 
            apoyamos a los agricultores en la toma de decisiones estratégicas para mejorar la producción y reducir el impacto de enfermedades en los cultivos.
          </p>
        </div>
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo-grande" />
          <span className="logo-text">Plantify</span>
        </div>
      </div>
    </div>
  );
}

export default Presentacion;