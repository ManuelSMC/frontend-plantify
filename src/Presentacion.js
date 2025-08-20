import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import logo from "./assets/logoPlantifi.png";

// Importar imágenes locales desde ./assets/
import img1 from "./assets/rabanos1.jfif";
import img2 from "./assets/rabanos2.jfif";
import img3 from "./assets/rabanos3.jfif";
import img4 from "./assets/rabanos4.jfif";

function Presentacion() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array de imágenes locales para el carrusel
  const images = [img1, img2, img3, img4];

  // Agrupar imágenes en pares
  const imagePairs = [];
  for (let i = 0; i < images.length; i += 2) {
    imagePairs.push(images.slice(i, i + 2));
  }

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/");
    }
  }, [navigate]);

  // Auto-slide effect for the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imagePairs.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [imagePairs.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + imagePairs.length) % imagePairs.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % imagePairs.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:w-1/2 text-left">
          <h2 className="text-4xl font-bold text-green-700 mb-4">¿Quiénes somos?</h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            Somos una empresa innovadora dedicada al monitoreo inteligente de cultivos mediante sensores avanzados. 
            Especializados en la medición de temperatura y humedad en rábanos, ofrecemos datos precisos en tiempo real para optimizar 
            el crecimiento y la salud de los cultivos. Además, nuestro sistema analiza las condiciones ambientales para identificar posibles 
            riesgos de plagas, permitiendo una respuesta temprana y efectiva. Con tecnología de vanguardia y un enfoque sostenible, 
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
      {/* Carousel Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="relative w-full h-96 overflow-hidden rounded-lg shadow-lg">
          {imagePairs.map((pair, index) => (
            <div
              key={index}
              className={`absolute w-full h-full flex transition-opacity duration-1000 ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
            >
              {pair.map((image, imgIndex) => (
                <img
                  key={imgIndex}
                  src={image}
                  alt={`Slide ${index * 2 + imgIndex + 1}`}
                  className="w-1/2 h-full object-contain"
                />
              ))}
            </div>
          ))}
          {/* Carousel Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-green-700 text-white p-3 rounded-full hover:bg-green-600 transition-colors duration-300"
          >
            &#10094; {/* Left arrow */}
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-green-700 text-white p-3 rounded-full hover:bg-green-600 transition-colors duration-300"
          >
            &#10095; {/* Right arrow */}
          </button>
          {/* Carousel Navigation Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
            {imagePairs.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? "bg-green-700" : "bg-gray-400"
                } hover:bg-green-600 transition-colors duration-300`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Presentacion;  