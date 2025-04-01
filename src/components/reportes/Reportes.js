import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import "../../App.css";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/logo.png"; // Importar el logo

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Reportes() {
  const navigate = useNavigate();
  const [datosSensores, setDatosSensores] = useState([]);
  const [datosNotificaciones, setDatosNotificaciones] = useState([]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [error, setError] = useState(null);

  // Validar autenticación
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/");
    }
  }, [navigate]);

  // Obtener datos del backend
  const fetchDatos = async () => {
    try {
      if (!fechaInicio || !fechaFin) {
        setError("Por favor selecciona un rango de fechas.");
        return;
      }
      const urlSensores = `https://plantify.jamadev.com/index.php/sensores/reporte?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
      const urlNotificaciones = `https://plantify.jamadev.com/index.php/notificaciones/reporte?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;

      const [respuestaSensores, respuestaNotificaciones] = await Promise.all([
        fetch(urlSensores),
        fetch(urlNotificaciones),
      ]);

      if (!respuestaSensores.ok || !respuestaNotificaciones.ok) {
        throw new Error("Error al obtener los datos para el reporte");
      }

      const sensores = await respuestaSensores.json();
      const notificaciones = await respuestaNotificaciones.json();

      // Depuración: Inspeccionar los datos recibidos
      console.log("Datos de sensores:", sensores);

      setDatosSensores(sensores);
      setDatosNotificaciones(notificaciones);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      setError("No se pudieron cargar los datos para el reporte");
    }
  };

  // Configuración de las gráficas
  const chartData = {
    labels: datosSensores.map((d) => new Date(d.fecha).toLocaleString("es-MX", { timeZone: "America/Mexico_City" })),
    datasets: [
      {
        label: "Calidad del Aire",
        data: datosSensores.map((d) => d.calidad_aire),
        borderColor: "#FF6384",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Humedad DHT11 (%)",
        data: datosSensores.map((d) => d.humedad),
        borderColor: "#36A2EB",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Humedad Suelo (%)",
        data: datosSensores.map((d) => d.humedad_suelo),
        borderColor: "#FFCE56",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Temperatura DHT11 (°C)",
        data: datosSensores.map((d) => d.temperaturaDHT11),
        borderColor: "#4BC0C0",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Temperatura DS18B20 (°C)",
        data: datosSensores.map((d) => d.temperaturaDS18B20),
        borderColor: "#9966FF",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14 }, padding: 20 },
      },
      title: {
        display: true,
        text: "Condiciones Ambientales del Invernadero",
        font: { size: 24, weight: "bold" },
        padding: { top: 20, bottom: 20 },
      },
      tooltip: { backgroundColor: "#285A43", titleFont: { size: 14 }, bodyFont: { size: 12 } },
    },
    scales: {
      x: {
        title: { display: true, text: "Fecha y Hora", font: { size: 16, weight: "bold" } },
        grid: { display: false },
      },
      y: {
        title: { display: true, text: "Valor", font: { size: 16, weight: "bold" } },
        grid: { color: "#e0e0e0" },
      },
    },
  };

  // Generar y descargar PDF
  const generarPDF = () => {
    const doc = new jsPDF();

    // Añadir el logo
    const img = new Image();
    img.src = logo;
    doc.addImage(img, "PNG", 10, 10, 40, 40); // Ajusta las dimensiones según el tamaño del logo

    // Título y subtítulo
    doc.setFontSize(20);
    doc.setTextColor(40, 90, 67); // Color #285A43
    doc.text("Reporte de Condiciones Ambientales", 60, 20);
    doc.setFontSize(16);
    doc.text("Invernadero Inteligente - Plantify", 60, 30);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rango de fechas: ${fechaInicio} - ${fechaFin}`, 60, 40);

    // Línea divisoria
    doc.setLineWidth(0.5);
    doc.setDrawColor(40, 90, 67);
    doc.line(10, 55, 200, 55);

    // Tabla de sensores
    doc.setFontSize(16);
    doc.setTextColor(40, 90, 67);
    doc.text("Datos de Sensores", 10, 65);
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      startY: 70,
      head: [["Fecha", "Calidad Aire", "Humedad DHT11", "Humedad Suelo", "Temp DHT11", "Temp DS18B20", "Plaga"]],
      body: datosSensores.map((d) => [
        new Date(d.fecha).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
        d.calidad_aire,
        d.humedad,
        d.humedad_suelo,
        d.temperaturaDHT11,
        d.temperaturaDS18B20,
        Number(d.plaga) === 1 ? "Sí" : "No",
      ]),
      styles: { fontSize: 10, cellPadding: 3, textColor: [50, 50, 50] },
      headStyles: { fillColor: [40, 90, 67], textColor: [255, 255, 255], fontSize: 12 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 60 },
    });

    // Tabla de notificaciones
    const y = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(16);
    doc.setTextColor(40, 90, 67);
    doc.text("Notificaciones", 10, y);
    doc.setTextColor(0, 0, 0);
    autoTable(doc, {
      startY: y + 5,
      head: [["Fecha", "Notificación"]],
      body: datosNotificaciones.map((n) => [
        new Date(n.fecha).toLocaleString("es-MX", { timeZone: "America/Mexico_City" }),
        n.notificacion,
      ]),
      styles: { fontSize: 10, cellPadding: 3, textColor: [50, 50, 50] },
      headStyles: { fillColor: [40, 90, 67], textColor: [255, 255, 255], fontSize: 12 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Pie de página
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${pageCount}`, 190, 290, { align: "right" });
      doc.text("Plantify © 2025", 10, 290);
    }

    doc.save(`reporte_invernadero_${fechaInicio}_a_${fechaFin}.pdf`);
  };

  return (
    <div>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "30px 40px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        <h2 style={{ color: "#285A43", fontSize: "2.5rem", fontWeight: "bold", marginBottom: "30px", textAlign: "center" }}>
          Reportes y Gráficas
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "40px",
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <label style={{ fontSize: "1.2rem", color: "#333", fontWeight: "500" }}>Fecha Inicio:</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <label style={{ fontSize: "1.2rem", color: "#333", fontWeight: "500" }}>Fecha Fin:</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                padding: "12px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
            />
          </div>
          <button
            onClick={fetchDatos}
            style={{
              padding: "12px 30px",
              backgroundColor: "#285A43",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1.1rem",
              fontWeight: "500",
              transition: "background-color 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1e4232")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#285A43")}
          >
            Generar Reporte
          </button>
          {datosSensores.length > 0 && (
            <button
              onClick={generarPDF}
              style={{
                padding: "12px 30px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "500",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#3d8b40")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#4CAF50")}
            >
              Descargar PDF
            </button>
          )}
        </div>

        {error && (
          <div
            style={{
              padding: "15px",
              marginBottom: "30px",
              backgroundColor: "#F8D7DA",
              color: "#721C24",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "600px",
              textAlign: "center",
              fontSize: "1.1rem",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {error}
          </div>
        )}

        {datosSensores.length > 0 && (
          <div
            style={{
              width: "90%",
              maxWidth: "1200px",
              height: "600px",
              marginBottom: "40px",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;