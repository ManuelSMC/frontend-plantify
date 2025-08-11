// src/components/Reportes.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import "../../App.css";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Reportes() {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState(null);
  const [dailyData, setDailyData] = useState({});
  const [weeklyData, setWeeklyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [annualData, setAnnualData] = useState({});

  // Validar autenticación
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/");
    }
  }, [navigate]);

  // Obtener historial desde el backend
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const url = "https://plantify.jamadev.com/index.php/sensores/historial";
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al obtener el historial");
        const data = await respuesta.json();
        setHistorial(data);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudo cargar el historial de sensores");
      }
    };
    fetchHistorial();
  }, []);

  // Procesar datos para agregados diarios, semanales, mensuales y anuales
  useEffect(() => {
    if (historial.length > 0) {
      const daily = {};
      const weekly = {};
      const monthly = {};
      const annual = {};

      historial.forEach((d) => {
        const date = new Date(d.fecha);
        const dayKey = date.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" });
        const weekKey = `${date.getFullYear()}-W${Math.floor((date.getDate() - 1) / 7) + 1}`;
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
        const yearKey = `${date.getFullYear()}`;

        // Inicializar si no existe
        [daily, weekly, monthly, annual].forEach((agg, index) => {
          const key = [dayKey, weekKey, monthKey, yearKey][index];
          if (!agg[key]) {
            agg[key] = {
              calidad_aire: [],
              humedad: [],
              humedad_suelo: [],
              temperaturaDHT11: [],
              temperaturaDS18B20: [],
              plaga: [], // Para plaga, usaremos promedio (fracción de detecciones)
            };
          }
        });

        // Agregar valores (parsear números)
        daily[dayKey].calidad_aire.push(Number(d.calidad_aire));
        daily[dayKey].humedad.push(Number(d.humedad));
        daily[dayKey].humedad_suelo.push(Number(d.humedad_suelo));
        daily[dayKey].temperaturaDHT11.push(Number(d.temperaturaDHT11));
        daily[dayKey].temperaturaDS18B20.push(Number(d.temperaturaDS18B20));
        daily[dayKey].plaga.push(Number(d.plaga));

        weekly[weekKey].calidad_aire.push(Number(d.calidad_aire));
        weekly[weekKey].humedad.push(Number(d.humedad));
        weekly[weekKey].humedad_suelo.push(Number(d.humedad_suelo));
        weekly[weekKey].temperaturaDHT11.push(Number(d.temperaturaDHT11));
        weekly[weekKey].temperaturaDS18B20.push(Number(d.temperaturaDS18B20));
        weekly[weekKey].plaga.push(Number(d.plaga));

        monthly[monthKey].calidad_aire.push(Number(d.calidad_aire));
        monthly[monthKey].humedad.push(Number(d.humedad));
        monthly[monthKey].humedad_suelo.push(Number(d.humedad_suelo));
        monthly[monthKey].temperaturaDHT11.push(Number(d.temperaturaDHT11));
        monthly[monthKey].temperaturaDS18B20.push(Number(d.temperaturaDS18B20));
        monthly[monthKey].plaga.push(Number(d.plaga));

        annual[yearKey].calidad_aire.push(Number(d.calidad_aire));
        annual[yearKey].humedad.push(Number(d.humedad));
        annual[yearKey].humedad_suelo.push(Number(d.humedad_suelo));
        annual[yearKey].temperaturaDHT11.push(Number(d.temperaturaDHT11));
        annual[yearKey].temperaturaDS18B20.push(Number(d.temperaturaDS18B20));
        annual[yearKey].plaga.push(Number(d.plaga));
      });

      // Calcular promedios
      const calculateAverages = (agg) => {
        Object.keys(agg).forEach((key) => {
          const data = agg[key];
          agg[key] = {
            calidad_aire: (data.calidad_aire.reduce((a, b) => a + b, 0) / data.calidad_aire.length).toFixed(2),
            humedad: (data.humedad.reduce((a, b) => a + b, 0) / data.humedad.length).toFixed(2),
            humedad_suelo: (data.humedad_suelo.reduce((a, b) => a + b, 0) / data.humedad_suelo.length).toFixed(2),
            temperaturaDHT11: (data.temperaturaDHT11.reduce((a, b) => a + b, 0) / data.temperaturaDHT11.length).toFixed(2),
            temperaturaDS18B20: (data.temperaturaDS18B20.reduce((a, b) => a + b, 0) / data.temperaturaDS18B20.length).toFixed(2),
            plaga: (data.plaga.reduce((a, b) => a + b, 0) / data.plaga.length).toFixed(2), // Fracción de detecciones
          };
        });
        return agg;
      };

      setDailyData(calculateAverages(daily));
      setWeeklyData(calculateAverages(weekly));
      setMonthlyData(calculateAverages(monthly));
      setAnnualData(calculateAverages(annual));
    }
  }, [historial]);

  // Función para generar datos de gráfica de barras
  const getBarChartData = (aggData) => ({
    labels: Object.keys(aggData).sort(), // Ordenar cronológicamente
    datasets: [
      {
        label: "Calidad del Aire (Promedio)",
        data: Object.values(aggData).map((p) => p.calidad_aire),
        backgroundColor: "rgba(59, 130, 246, 0.8)", // Azul moderno
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Humedad del Aire (%) (Promedio)",
        data: Object.values(aggData).map((p) => p.humedad),
        backgroundColor: "rgba(16, 185, 129, 0.8)", // Verde esmeralda
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 1,
      },
      {
        label: "Humedad del Suelo (%) (Promedio)",
        data: Object.values(aggData).map((p) => p.humedad_suelo),
        backgroundColor: "rgba(245, 158, 11, 0.8)", // Ámbar
        borderColor: "rgba(245, 158, 11, 1)",
        borderWidth: 1,
      },
      {
        label: "Temperatura del Aire (°C) (Promedio)",
        data: Object.values(aggData).map((p) => p.temperaturaDHT11),
        backgroundColor: "rgba(236, 72, 153, 0.8)", // Rosa magenta
        borderColor: "rgba(236, 72, 153, 1)",
        borderWidth: 1,
      },
      {
        label: "Temperatura del Suelo (°C) (Promedio)",
        data: Object.values(aggData).map((p) => p.temperaturaDS18B20),
        backgroundColor: "rgba(139, 92, 246, 0.8)", // Violeta
        borderColor: "rgba(139, 92, 246, 1)",
        borderWidth: 1,
      },
      {
        label: "Detección de Plagas (Fracción de detecciones)",
        data: Object.values(aggData).map((p) => p.plaga),
        backgroundColor: "rgba(234, 179, 8, 0.8)", // Amarillo
        borderColor: "rgba(234, 179, 8, 1)",
        borderWidth: 1,
      },
    ],
  });

  const barChartOptions = (title, subtitle) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 16 }, padding: 20, usePointStyle: true }, // Leyenda más clara y grande
      },
      title: {
        display: true,
        text: title,
        font: { size: 28, weight: "bold" },
        padding: { top: 20, bottom: 10 },
      },
      subtitle: {
        display: true,
        text: subtitle,
        font: { size: 18, style: "italic" },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.9)", // Fondo oscuro para contraste
        titleFont: { size: 18 },
        bodyFont: { size: 16 },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`, // Tooltips descriptivos
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Período de Tiempo", font: { size: 18, weight: "bold" } },
        grid: { display: false },
        ticks: { font: { size: 14 } },
      },
      y: {
        title: { display: true, text: "Valor Promedio", font: { size: 18, weight: "bold" } },
        grid: { color: "rgba(209, 213, 219, 0.5)" }, // Líneas suaves
        ticks: { font: { size: 14 } },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-100"> {/* Fondo claro y moderno */}
      <Navbar />
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 20px" }}>
        <h2 style={{ color: "#1F2937", fontSize: "2.5rem", fontWeight: "700", marginBottom: "20px", textAlign: "center" }}>
          Reportes de Datos de Sensores
        </h2>
        <p style={{ color: "#4B5563", fontSize: "1.25rem", textAlign: "center", marginBottom: "40px" }}>
          Aquí puedes ver los promedios de las mediciones de tus sensores agrupados por día, semana, mes y año. Cada barra representa el promedio de un indicador ambiental. Pasa el mouse sobre las barras para más detalles.
        </p>

        {error && (
          <div
            style={{
              padding: "20px",
              marginBottom: "40px",
              backgroundColor: "#FEE2E2",
              color: "#B91C1C",
              borderRadius: "12px",
              textAlign: "center",
              fontSize: "1.25rem",
              fontWeight: "500",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            {error}
          </div>
        )}

        {/* Sección Diaria */}
        {Object.keys(dailyData).length > 0 && (
          <div style={{ marginBottom: "80px" }}>
            <div
              style={{
                width: "100%",
                height: "550px",
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "16px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Bar
                data={getBarChartData(dailyData)}
                options={barChartOptions("Promedios Diarios de Condiciones Ambientales", "Muestra el promedio diario de cada medición.")}
              />
            </div>
          </div>
        )}

        {/* Sección Semanal */}
        {Object.keys(weeklyData).length > 0 && (
          <div style={{ marginBottom: "80px" }}>
            <div
              style={{
                width: "100%",
                height: "550px",
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "16px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Bar
                data={getBarChartData(weeklyData)}
                options={barChartOptions("Promedios Semanales de Condiciones Ambientales", "Muestra el promedio semanal de cada medición.")}
              />
            </div>
          </div>
        )}

        {/* Sección Mensual */}
        {Object.keys(monthlyData).length > 0 && (
          <div style={{ marginBottom: "80px" }}>
            <div
              style={{
                width: "100%",
                height: "550px",
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "16px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Bar
                data={getBarChartData(monthlyData)}
                options={barChartOptions("Promedios Mensuales de Condiciones Ambientales", "Muestra el promedio mensual de cada medición.")}
              />
            </div>
          </div>
        )}

        {/* Sección Anual */}
        {Object.keys(annualData).length > 0 && (
          <div style={{ marginBottom: "80px" }}>
            <div
              style={{
                width: "100%",
                height: "550px",
                backgroundColor: "white",
                padding: "32px",
                borderRadius: "16px",
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Bar
                data={getBarChartData(annualData)}
                options={barChartOptions("Promedios Anuales de Condiciones Ambientales", "Muestra el promedio anual de cada medición.")}
              />
            </div>
          </div>
        )}

        {historial.length === 0 && !error && (
          <div style={{ textAlign: "center", color: "#6B7280", fontSize: "1.5rem", marginTop: "60px" }}>
            Cargando datos de sensores...
          </div>
        )}
      </div>
    </div>
  );
}

export default Reportes;