import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Navbar";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import "../../App.css";

import rabanoLlorando from "../../assets/rabano_llorando.png";
import rabanoEnfermo from "../../assets/rabano_enfermo.png";
import rabanoLloroso from "../../assets/rabano_lloroso.png";
import rabano2 from "../../assets/rabano2.png";
import rabanoRegando from "../../assets/rabano_regando.png";
import rabanoLimpio from "../../assets/rabano_limpio.png";

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
  }, []);

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

  // Función para determinar el color según los rangos
  const getSensorStatus = (sensor, value) => {
    if (value === null) return "#D1D5DB"; // Gris por defecto si no hay datos
    switch (sensor) {
      case "CalidadAire":
        if (value >= 80 && value <= 100) return "#10B981";
        if (value >= 60 && value < 80) return "#F59E0B";
        return "#EF4444";
      case "HumedadDHT11":
        if (value >= 60 && value <= 80) return "#10B981";
        if ((value >= 50 && value < 60) || (value > 80 && value <= 90)) return "#F59E0B";
        return "#EF4444";
      case "HumedadSuelo":
        if (value >= 60 && value <= 65) return "#10B981";
        if ((value >= 50 && value < 60) || (value > 65 && value <= 75)) return "#F59E0B";
        return "#EF4444";
      case "TemperaturaDHT11":
        if (value >= 15 && value <= 18) return "#10B981";
        if ((value >= 12 && value < 15) || (value > 18 && value <= 21)) return "#F59E0B";
        return "#EF4444";
      case "TemperaturaDS18B20":
        if (value >= 18 && value <= 29) return "#10B981";
        if ((value >= 15 && value < 18) || (value > 29 && value <= 32)) return "#F59E0B";
        return "#EF4444";
      default:
        return "#D1D5DB";
    }
  };

  // Función para obtener imagen de predicción según el nivel
  const getPredictionImage = (tipo, valor) => {
    if (valor === null) return null;
    if (valor >= 70) {
      return tipo === "riego" ? rabanoLlorando : rabanoEnfermo;
    } else if (valor >= 40) {
      return tipo === "riego" ? rabanoLloroso : rabano2;
    } else {
      return tipo === "riego" ? rabanoRegando : rabanoLimpio;
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

        {/* Sensores */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
          }}
        >
          {[
            { label: "Calidad del Aire", value: datos.CalidadAire, unidad: "%", sensor: "CalidadAire" },
            { label: "Humedad del Aire", value: datos.HumedadDHT11, unidad: "%", sensor: "HumedadDHT11" },
            { label: "Humedad del Suelo", value: datos.HumedadSuelo, unidad: "%", sensor: "HumedadSuelo" },
            { label: "Temperatura del Aire", value: datos.TemperaturaDHT11, unidad: "°C", sensor: "TemperaturaDHT11" },
            { label: "Temperatura del Suelo", value: datos.TemperaturaDS18B20, unidad: "°C", sensor: "TemperaturaDS18B20" },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: `0 8px 16px -2px ${getSensorStatus(item.sensor, item.value)}80, 0 16px 32px -4px ${getSensorStatus(item.sensor, item.value)}60`,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.125rem", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "2.25rem", fontWeight: "700", color: "#1F2937" }}>
                {item.value !== null ? `${item.value} ${item.unidad}` : "Cargando..."}
              </div>
            </div>
          ))}
        </div>

        {/* Sección de Predicciones */}
        <div
          style={{
            marginTop: "32px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {prediccionesError ? (
            <div
              style={{
                padding: "16px",
                backgroundColor: "#FEE2E2",
                color: "#B91C1C",
                borderRadius: "12px",
                textAlign: "center",
                gridColumn: "1 / -1",
              }}
            >
              {prediccionesError}
            </div>
          ) : (
            <>
              {/* Riego */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  background: `url(${getPredictionImage("riego", predicciones.probabilidad_riego)}) center/cover no-repeat`,
                  minHeight: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "8px" }}>Predicción de Riego</h3>
                  <p style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                    {predicciones.probabilidad_riego !== null
                      ? `${predicciones.probabilidad_riego}%`
                      : "Cargando..."}
                  </p>
                </div>
              </div>

              {/* Fumigación */}
              <div
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
                  background: `url(${getPredictionImage("fumigacion", predicciones.probabilidad_fumigacion)}) center/cover no-repeat`,
                  minHeight: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(0,0,0,0.5)",
                    padding: "20px",
                    borderRadius: "12px",
                    textAlign: "center",
                    color: "white",
                  }}
                >
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "8px" }}>Predicción de Fumigación</h3>
                  <p style={{ fontSize: "1.25rem", fontWeight: "600" }}>
                    {predicciones.probabilidad_fumigacion !== null
                      ? `${predicciones.probabilidad_fumigacion}%`
                      : "Cargando..."}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Monitoreo;
