import React from "react";
import { useParams } from "react-router-dom";
import { styles } from "../styles/PlantaEstadoStyles"; // Importa los estilos desde PlantaEstadoStyles.js
import { Line } from 'react-chartjs-2'; // Importa el componente de gráfica

// 👇 Importa y registra los módulos necesarios de Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// ✅ Registro de módulos (es obligatorio en Chart.js v3+)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const plantaData = {
  id: 1,
  nombre: "Cactus",
  imagen: "/images/cactus.png",
  descripcion: "El cactus es una planta que requiere poca agua y mucha luz solar.",
  temperatura: [20, 21, 22, 23, 24, 25, 26],
  humedad: [30, 35, 40, 45, 50, 55, 60],
};

function PlantaEstado() {
  const { id } = useParams();

  const handleRegar = () => {
    alert("Planta regada");
  };

  const handleFumigar = () => {
    alert("Planta fumigada");
  };

  const dataTemperatura = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Temperatura (°C)",
        data: plantaData.temperatura,
        fill: false,
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4 // Hace la línea más curva, opcional
      },
    ],
  };

  const dataHumedad = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Humedad (%)",
        data: plantaData.humedad,
        fill: false,
        backgroundColor: "rgba(153,102,255,1)",
        borderColor: "rgba(153,102,255,1)",
        tension: 0.4
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false, // Título directo en la gráfica (ya lo pones arriba)
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Estado de la Planta {id}</h1>
      <div style={styles.infoContainer}>
        <img src={plantaData.imagen} alt={plantaData.nombre} style={styles.image} />
        <div style={styles.details}>
          <h2 style={styles.plantName}>{plantaData.nombre}</h2>
          <p style={styles.description}>{plantaData.descripcion}</p>
          <button style={styles.button} onClick={handleRegar}>Regar</button>
          <button style={styles.button} onClick={handleFumigar}>Fumigar</button>
        </div>
      </div>
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Temperatura</h3>
        <Line data={dataTemperatura} options={options} />
      </div>
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>Humedad</h3>
        <Line data={dataHumedad} options={options} />
      </div>
    </div>
  );
}

export default PlantaEstado;
