// src/components/HistorialSensores.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import "../../App.css";

function HistorialSensores() {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState("");

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
        const url = fechaFiltro
          ? `http://localhost/backendPlantify/index.php/sensores/historial?fecha=${fechaFiltro}`
          : "http://localhost/backendPlantify/index.php/sensores/historial";
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
  }, [fechaFiltro]); // Se ejecuta cada vez que cambia la fecha de filtro

  // Manejar cambio en el input de fecha
  const handleFechaChange = (e) => {
    setFechaFiltro(e.target.value); // Actualiza el filtro con la fecha seleccionada
  };

  // Estilos
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  };

  const thStyle = {
    backgroundColor: "#285A43",
    color: "white",
    padding: "10px",
    textAlign: "left",
    fontSize: "0.9rem",
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eee",
  };

  const plagaStyle = (plaga) => ({
    padding: "5px 10px",
    backgroundColor: plaga === 1 ? "#F8D7DA" : "#D4EDDA",
    color: plaga === 1 ? "#721C24" : "#155724",
    borderRadius: "15px",
    fontSize: "0.85rem",
    display: "inline-block",
  });

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px 40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#333", fontSize: "1.8rem", margin: 0 }}>
            Historial de Datos de Sensores
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <label style={{ color: "#333", fontSize: "1rem" }}>
              Filtrar por fecha:
            </label>
            <input
              type="date"
              value={fechaFiltro}
              onChange={handleFechaChange}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: "#F8D7DA",
              color: "#721C24",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Calidad del Aire</th>
                <th style={thStyle}>Humedad (DHT11)</th>
                <th style={thStyle}>Humedad del Suelo</th>
                <th style={thStyle}>Temperatura (DHT11)</th>
                <th style={thStyle}>Temperatura (DS18B20)</th>
                <th style={thStyle}>Plaga</th>
                <th style={thStyle}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                    {fechaFiltro
                      ? "No hay datos para la fecha seleccionada."
                      : "No hay datos históricos disponibles."}
                  </td>
                </tr>
              ) : (
                historial.map((registro) => (
                  <tr key={registro.id_sensores}>
                    <td style={tdStyle}>{registro.id_sensores}</td>
                    <td style={tdStyle}>{registro.calidad_aire}</td>
                    <td style={tdStyle}>{registro.humedad} %</td>
                    <td style={tdStyle}>{registro.humedad_suelo} %</td>
                    <td style={tdStyle}>{registro.temperaturaDHT11} °C</td>
                    <td style={tdStyle}>{registro.temperaturaDS18B20} °C</td>
                    <td style={tdStyle}>
                      <span style={plagaStyle(registro.plaga)}>
                        {registro.plaga === "1" ? "Sí" : "No"}
                      </span>
                    </td>
                    <td style={tdStyle}>{registro.fecha}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistorialSensores;