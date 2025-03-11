import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles/Moni.Styles"; // Importa los estilos desde MonitoreoStyles.js

const invernaderos = [
  { id: 1, nombre: "Invernadero 1" },
  { id: 2, nombre: "Invernadero 2" },
  { id: 3, nombre: "Invernadero 3" },
  { id: 4, nombre: "Invernadero 4" },
];

function Monitoreo() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/MoniInv"); // Redirige solo a /MoniInv sin el id
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Monitoreo de Invernaderos</h1>
      <div style={styles.grid}>
        {invernaderos.map((invernadero) => (
          <div
            key={invernadero.id}
            style={styles.card}
            onClick={handleRedirect} // Redirige a la página sin el id
          >
            <h2 style={styles.cardTitle}>{invernadero.nombre}</h2>
            {/* El ID ya no se muestra aquí */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Monitoreo;

