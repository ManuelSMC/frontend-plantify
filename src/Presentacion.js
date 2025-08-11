import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import logo from "./assets/logoPlantifi.png";

function Presentacion() {
  const navigate = useNavigate();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 text-left">
          <h2 className="text-4xl font-bold text-green-700 mb-4">¿Quiénes somos?</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Somos una empresa innovadora dedicada al monitoreo inteligente de cultivos mediante sensores avanzados. 
            Especializados en la medición de temperatura y humedad en girasoles, ofrecemos datos precisos en tiempo real para optimizar 
            el crecimiento y la salud de los cultivos. Además, nuestro sistema analiza las condiciones ambientales para identificar posibles 
            riesgos de plagas, como pulgones, permitiendo una respuesta temprana y efectiva. Con tecnología de vanguardia y un enfoque sostenible, 
            apoyamos a los agricultores en la toma de decisiones estratégicas para mejorar la producción y reducir el impacto de enfermedades en los cultivos.
          </p>
        </div>
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="relative bg-green-700 rounded-full p-4 shadow-lg">
            <img 
              src={logo} 
              alt="Logo" 
              className="w-64 h-64 object-contain transform hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <span className="text-3xl font-semibold text-green-700 mt-4">Plantify</span>
        </div>
      </div>
    </div>
  );
}

export default Presentacion;