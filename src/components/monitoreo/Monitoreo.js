// src/components/Monitoreo.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import "../../App.css";

function Monitoreo() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    CalidadAire: null,
    HumedadDHT11: null,
    HumedadSuelo: null,
    TemperaturaDHT11: null,
    TemperaturaDS18B20: null,
  });
  const [datosPrevios, setDatosPrevios] = useState(null);
  const [esCargaInicial, setEsCargaInicial] = useState(true);
  const [error, setError] = useState(null);
  // Nuevo estado para las predicciones
  const [predicciones, setPredicciones] = useState({
    probabilidad_riego: null,
    probabilidad_fumigacion: null,
  });
  const [prediccionesError, setPrediccionesError] = useState(null);

  // Validar autenticación
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/");
    }
  }, [navigate]);

  // Escuchar cambios en Firebase
  useEffect(() => {
    const datosRef = ref(database, "/");
    const unsubscribe = onValue(
      datosRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const nuevosDatos = {
            CalidadAire: data.CalidadAire || 0,
            HumedadDHT11: data.HumedadDHT11 || 0,
            HumedadSuelo: data.HumedadSuelo || 0,
            TemperaturaDHT11: data.TemperaturaDHT11 || 0,
            TemperaturaDS18B20: data.TemperaturaDS18B20 || 0,
          };

          const datosActualString = JSON.stringify(nuevosDatos);
          const datosPreviosString = JSON.stringify(datosPrevios);

          setDatos(nuevosDatos);

          if (!esCargaInicial && datosActualString !== datosPreviosString) {
            guardarDatosEnBackend(nuevosDatos);
          }

          setDatosPrevios(nuevosDatos);
          if (esCargaInicial) setEsCargaInicial(false);

          setError(null);
        } else {
          setError("No hay datos disponibles");
        }
      },
      (error) => {
        console.error("Error al obtener datos:", error);
        setError("Error al conectar con Firebase");
      }
    );

    return () => unsubscribe();
  }, [esCargaInicial, datosPrevios]);

  // Obtener predicciones desde la API
  useEffect(() => {
    const fetchPredicciones = async () => {
      try {
        const respuesta = await fetch("https://plantify.jamadev.com/index.php/prediction", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!respuesta.ok) {
          throw new Error("Error al obtener las predicciones: " + respuesta.statusText);
        }
        const resultado = await respuesta.json();
        if (resultado.status === "success") {
          setPredicciones({
            probabilidad_riego: resultado.data.probabilidad_riego,
            probabilidad_fumigacion: resultado.data.probabilidad_fumigacion,
          });
          setPrediccionesError(null);
        } else {
          throw new Error(resultado.message || "Respuesta inválida de la API");
        }
      } catch (error) {
        console.error("Error al obtener predicciones:", error);
        setPrediccionesError("No se pudieron cargar las predicciones");
      }
    };

    fetchPredicciones();
  }, []); // Se ejecuta solo al montar el componente

  const guardarDatosEnBackend = async (datos) => {
    try {
      const respuesta = await fetch("https://plantify.jamadev.com/index.php/sensores/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calidad_aire: datos.CalidadAire,
          humedad: datos.HumedadDHT11,
          humedad_suelo: datos.HumedadSuelo,
          temperaturaDHT11: datos.TemperaturaDHT11,
          temperaturaDS18B20: datos.TemperaturaDS18B20,
          plaga: false,
        }),
      });
      if (!respuesta.ok) console.error("Error al guardar en el backend:", await respuesta.text());
    } catch (error) {
      console.error("Error de conexión con el backend:", error);
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
            Monitoreo en Tiempo Real
          </h2>
          <button
            onClick={() => navigate("/historial-sensores")}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "6px",
              backgroundColor: "#10B981",
              color: "white",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            Ver Historial
          </button>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.125rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
              Calidad del Aire
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: "700", color: "#1F2937" }}>
              {datos.CalidadAire !== null ? datos.CalidadAire : "Cargando..."}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.125rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
              Humedad (DHT11)
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: "700", color: "#1F2937" }}>
              {datos.HumedadDHT11 !== null
                ? `${datos.HumedadDHT11} %`
                : "Cargando..."}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.125rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
              Humedad del Suelo
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: "700", color: "#1F2937" }}>
              {datos.HumedadSuelo !== null
                ? `${datos.HumedadSuelo} %`
                : "Cargando..."}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.125rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
              Temperatura (DHT11)
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: "700", color: "#1F2937" }}>
              {datos.TemperaturaDHT11 !== null
                ? `${datos.TemperaturaDHT11} °C`
                : "Cargando..."}
            </div>
          </div>
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "1.125rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
              Temperatura (DS18B20)
            </div>
            <div style={{ fontSize: "2.25rem", fontWeight: "700", color: "#1F2937" }}>
              {datos.TemperaturaDS18B20 !== null
                ? `${datos.TemperaturaDS18B20} °C`
                : "Cargando..."}
            </div>
          </div>
        </div>

        {/* Sección de Predicciones */}
        <div
          style={{
            marginTop: "32px",
            padding: "24px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            textAlign: "center",
          }}
        >
          <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1F2937", marginBottom: "16px" }}>
            Predicciones para Mañana
          </h3>
          {prediccionesError ? (
            <p style={{ color: "#B91C1C", fontSize: "1.125rem" }}>{prediccionesError}</p>
          ) : (
            <>
              <p style={{ fontSize: "1.25rem", color: "#374151", marginBottom: "8px" }}>
                Probabilidad de riego: {predicciones.probabilidad_riego !== null
                  ? `${predicciones.probabilidad_riego}%`
                  : "Cargando..."}
              </p>
              <p style={{ fontSize: "1.25rem", color: "#374151" }}>
                Probabilidad de fumigación: {predicciones.probabilidad_fumigacion !== null
                  ? `${predicciones.probabilidad_fumigacion}%`
                  : "Cargando..."}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Monitoreo;