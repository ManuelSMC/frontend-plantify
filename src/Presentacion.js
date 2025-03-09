import React from "react";
import { Link } from "react-router-dom"; // Importa Link
import "./App.css"; // Asegúrate de que el archivo CSS esté correcto
import logo from "./assets/logo.png"; 

function Presentacion() {
  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="brand">
            <img src={logo} alt="Logo" className="logo2" />
            <span className="brand-name">Plantify</span>
          </div>
          <ul className="nav-links">
            <li><Link to="/presentacion">Inicio</Link></li> 
            <li><Link to="/usuarios">Usuarios</Link></li>
            <li><a href="#">Notificaciones</a></li>
            <li><a href="#">Monitoreo</a></li>
          </ul>
        </div>
      </nav>

      {/* Sección principal con dos columnas */}
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
