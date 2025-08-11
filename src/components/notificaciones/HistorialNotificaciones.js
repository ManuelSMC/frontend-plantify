import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import "../../App.css";

function HistorialNotificaciones() {
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState(""); // Estado para el input de página
  const pageSize = 20; // Número de registros por página, ajustable

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
        // Convertir la fecha al formato año-día-mes si existe
        let formattedFechaFiltro = "";
        if (fechaFiltro) {
          const [year, month, day] = fechaFiltro.split("-");
          formattedFechaFiltro = `${year}-${day}-${month}`;
        }

        const url = formattedFechaFiltro
          ? `https://plantify.jamadev.com/index.php/notificaciones/historial?fecha=${formattedFechaFiltro}`
          : "https://plantify.jamadev.com/index.php/notificaciones/historial";
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al obtener el historial de notificaciones");
        const data = await respuesta.json();
        setHistorial(data);
        setError(null);
        setCurrentPage(1); // Reiniciar a la primera página al cambiar el filtro
        setPageInput(""); // Limpiar el input de página
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

  // Manejar cambio en el input de página
  const handlePageInputChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Solo permite números
      setPageInput(value);
    }
  };

  // Manejar la navegación a la página ingresada
  const handleGoToPage = () => {
    const page = parseInt(pageInput, 10);
    const totalPages = Math.ceil(historial.length / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInput(""); // Limpiar el input después de navegar
    } else {
      setError(`Por favor, ingrese un número de página válido entre 1 y ${totalPages}`);
      setPageInput("");
    }
  };

  // Paginación
  const totalPages = Math.ceil(historial.length / pageSize);
  const paginatedData = historial.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageInput(""); // Limpiar el input al cambiar página
    }
  };

  return (
    <div style={{ backgroundColor: "#F3F4F6", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "32px 64px", maxWidth: "1280px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2 style={{ color: "#1F2937", fontSize: "1.875rem", fontWeight: "600", margin: 0 }}>
            Historial de Notificaciones
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <label style={{ color: "#374151", fontSize: "1rem", fontWeight: "500" }}>
              Filtrar por fecha:
            </label>
            <input
              type="date"
              value={fechaFiltro}
              onChange={handleFechaChange}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #D1D5DB",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s ease",
              }}
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "24px",
              backgroundColor: "#FEE2E2",
              color: "#B91C1C",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    borderTopLeftRadius: "8px",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Notificación
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    borderTopRightRadius: "8px",
                  }}
                >
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "center", color: "#6B7280", padding: "32px" }}
                  >
                    {fechaFiltro
                      ? "No hay notificaciones para la fecha seleccionada."
                      : "No hay notificaciones históricas disponibles."}
                  </td>
                </tr>
              ) : (
                paginatedData.map((notificacion, index) => (
                  <tr key={notificacion.id_notificacion} style={{ backgroundColor: index % 2 === 0 ? "#F9FAFB" : "white" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {notificacion.id_notificacion}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {notificacion.notificacion}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {notificacion.fecha}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "24px",
              gap: "12px",
            }}
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: "8px 16px",
                backgroundColor: currentPage === 1 ? "#E5E7EB" : "#10B981",
                color: currentPage === 1 ? "#9CA3AF" : "white",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              Anterior
            </button>
            <span style={{ color: "#374151", fontWeight: "500" }}>
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: "8px 16px",
                backgroundColor: currentPage === totalPages ? "#E5E7EB" : "#10B981",
                color: currentPage === totalPages ? "#9CA3AF" : "white",
                border: "none",
                borderRadius: "6px",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                transition: "background-color 0.2s ease",
              }}
            >
              Siguiente
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="text"
                value={pageInput}
                onChange={handlePageInputChange}
                placeholder="Ir a página"
                style={{
                  padding: "8px",
                  width: "100px",
                  borderRadius: "6px",
                  border: "1px solid #D1D5DB",
                  fontSize: "0.875rem",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
              <button
                onClick={handleGoToPage}
                disabled={!pageInput || isNaN(parseInt(pageInput, 10))}
                style={{
                  padding: "8px 16px",
                  backgroundColor: !pageInput || isNaN(parseInt(pageInput, 10)) ? "#E5E7EB" : "#10B981",
                  color: !pageInput || isNaN(parseInt(pageInput, 10)) ? "#9CA3AF" : "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: !pageInput || isNaN(parseInt(pageInput, 10)) ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s ease",
                }}
              >
                Ir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistorialNotificaciones;