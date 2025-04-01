import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import "../../App.css";

function HistorialNotificaciones() {
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

  // Obtener historial de notificaciones desde el backend
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const url = fechaFiltro
          ? `https://plantify.jamadev.com/index.php/notificaciones/historial?fecha=${fechaFiltro}`
          : "https://plantify.jamadev.com/index.php/notificaciones/historial";
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al obtener el historial de notificaciones");
        const data = await respuesta.json();
        setHistorial(data);
        setError(null);
      } catch (err) {
        console.error("Error:", err);
        setError("No se pudo cargar el historial de notificaciones");
      }
    };
    fetchHistorial();
  }, [fechaFiltro]);

  // Manejar cambio en el input de fecha
  const handleFechaChange = (e) => {
    setFechaFiltro(e.target.value);
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
            Historial de Notificaciones
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
                <th style={thStyle}>Notificación</th>
                <th style={thStyle}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                    {fechaFiltro
                      ? "No hay notificaciones para la fecha seleccionada."
                      : "No hay notificaciones históricas disponibles."}
                  </td>
                </tr>
              ) : (
                historial.map((notificacion) => (
                  <tr key={notificacion.id_notificacion}>
                    <td style={tdStyle}>{notificacion.id_notificacion}</td>
                    <td style={tdStyle}>{notificacion.notificacion}</td>
                    <td style={tdStyle}>{notificacion.fecha}</td>
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

export default HistorialNotificaciones;