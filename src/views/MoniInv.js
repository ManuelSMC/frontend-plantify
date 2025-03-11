import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles/MoniInvStyles"; // Importa los estilos desde MoniInvStyles.js

const plantas = [
  {
    id: 1,
    nombre: "Cactus",
    imagen: "/images/cactus.png",
    advertencia: "Riego insuficiente",
    alerta: true,
  },
  {
    id: 2,
    nombre: "Suculenta",
    imagen: "/images/suculenta.png",
    advertencia: "",
    alerta: false,
  },
  {
    id: 3,
    nombre: "Hojas",
    imagen: "/images/hojas.png",
    advertencia: "Exceso de luz solar",
    alerta: true,
  },
];

function MoniInv() {
  const navigate = useNavigate();

  const handleRedirect = (id) => {
    navigate(`/estadoplanta/${id}`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Monitoreo de Plantas</h1>
      <div style={styles.grid}>
        {plantas.map((planta) => (
          <div
            key={planta.id}
            style={styles.card}
            onClick={() => handleRedirect(planta.id)}
          >
            <img src={planta.imagen} alt={planta.nombre} style={styles.image} />
            <h2 style={styles.cardTitle}>{planta.nombre}</h2>
            {planta.alerta && (
              <div style={styles.alertContainer}>
                <i className="fas fa-exclamation-triangle" style={styles.icon}></i>
                <p style={styles.advertencia}>{planta.advertencia}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MoniInv;