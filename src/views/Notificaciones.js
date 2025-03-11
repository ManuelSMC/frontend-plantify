import React from "react";
import { styles } from "../styles/NotiStyles"; // Importa los estilos desde NotiStyles.js

const notificacionesData = [
  {
    id: 1,
    mensaje: "⚠️ Se detectaron plagas en esta planta.",
    fecha: "ID 0101",
    imagen: "/images/cactus.png",
    color: "#ff6347", // Rojo
  },
  {
    id: 2,
    mensaje: "⚠️ Nivel de humedad bajo. Riega pronto.",
    fecha: "ID 0103",
    imagen: "/images/suculenta.png",
    color: "#ffa500", // Naranja
  },
  {
    id: 3,
    mensaje: "⚠️ Es hora de regar esta planta.",
    fecha: "ID 0102",
    imagen: "/images/hojas.png",
    color: "#ffd700", // Amarillo
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
                <img
                  src={notificacion.imagen}
                  alt="Imagen de notificación"
                  style={styles.image}
                />
                <i className="fas fa-bell" style={styles.notificationIcon}></i>
              </div>
              <p style={{ ...styles.message, color: notificacion.color }}>
                {notificacion.mensaje}
              </p>
              <p style={styles.date}>{notificacion.fecha}</p>
            </li>
          ))}
        </ul>
      </div>
      <div style={styles.rightContainer}>
        <h1 style={styles.title2}>Recomendaciones</h1>
        <p style={styles.recommendations}>
          Para mantener tus plantas saludables, asegúrate de regarlas regularmente, proporcionarles suficiente luz solar y utilizar fertilizantes adecuados. Además, es importante podar las plantas para promover un crecimiento saludable y prevenir enfermedades.
        </p>
      </div>
    </div>
  );
}

export default Notificaciones;
