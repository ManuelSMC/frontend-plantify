import React from "react";
import { styles } from "../styles/NotiStyles"; // Importa los estilos desde NotiStyles.js

const notificacionesData = [
  {
    id: 1,
    mensaje: "Nueva planta disponible en el catálogo.",
    fecha: "ID 0101",
    imagen: "/images/cactus.png", // Ruta de la imagen de cactus
  },
  {
    id: 2,
    mensaje: "Suculenta en optimas condiciones. ",
    fecha: "ID01003",
    imagen: "/images/suculenta.png", // Ruta de la imagen de suculenta
  },
  {
    id: 3,
    mensaje: "Nueva oferta en macetas.",
    fecha: "ID 0102",
    imagen: "/images/hojas.png", // Ruta de la imagen de hojas
  },
];

function Notificaciones() {
  return (
    <div style={styles.container}>
      <div style={styles.leftContainer}>
        <h1 style={styles.title}>Notificaciones</h1>
        <ul style={styles.list}>
          {notificacionesData.map((notificacion) => (
            <li key={notificacion.id} style={styles.listItem}>
              <div style={styles.imageContainer}>
                <img src={notificacion.imagen} alt="Imagen de notificación" style={styles.image} />
                <i className="fas fa-bell" style={styles.icon}></i>
              </div>
              <p style={styles.message}>{notificacion.mensaje}</p>
              <p style={styles.date}>{notificacion.fecha}</p>
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.rightContainer}>
        <h1 style={styles.title2}>Recomendaciones </h1>
        <p style={styles.recommendations}>
          Para mantener tus plantas saludables, asegúrate de regarlas regularmente, proporcionarles suficiente luz solar y utilizar fertilizantes adecuados. Además, es importante podar las plantas para promover un crecimiento saludable y prevenir enfermedades.
        </p>
      </div>
    </div>
  );
}

export default Notificaciones;