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
  const [datosPrevios, setDatosPrevios] = useState(null); // Estado para los datos previos
  const [esCargaInicial, setEsCargaInicial] = useState(true); // Bandera para carga inicial
  const [error, setError] = useState(null);

  // Validar autenticación
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/");
    }
  }, [navigate]);

  // Escuchar cambios en Firebase y enviar al backend solo si cambian los datos
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

          // Convertir a string para comparar fácilmente
          const datosActualString = JSON.stringify(nuevosDatos);
          const datosPreviosString = JSON.stringify(datosPrevios);

          // Actualizar la interfaz siempre
          setDatos(nuevosDatos);

          // Solo guardar en el backend si no es la carga inicial y los datos cambiaron
          if (!esCargaInicial && datosActualString !== datosPreviosString) {
            guardarDatosEnBackend(nuevosDatos);
          }

          // Actualizar datosPrevios y marcar la carga inicial como completada
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
  }, [esCargaInicial, datosPrevios]); // Dependencias actualizadas

  const guardarDatosEnBackend = async (datos) => {
    try {
      const respuesta = await fetch("http://localhost/backendPlantify/index.php/sensores/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calidad_aire: datos.CalidadAire,
          humedad: datos.HumedadDHT11,
          humedad_suelo: datos.HumedadSuelo,
          temperaturaDHT11: datos.TemperaturaDHT11,
          temperaturaDS18B20: datos.TemperaturaDS18B20,
          plaga: false, // Puedes agregar lógica para determinar plaga
        }),
      });
      if (!respuesta.ok) console.error("Error al guardar en el backend:", await respuesta.text());
    } catch (error) {
      console.error("Error de conexión con el backend:", error);
    }
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    flex: "1",
    minWidth: "200px",
    margin: "10px",
  };

  const valueStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#285A43",
    marginTop: "10px",
  };

  const labelStyle = {
    fontSize: "1rem",
    color: "#333",
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
            Monitoreo en Tiempo Real
          </h2>
          <button
            onClick={() => navigate("/historial-sensores")}
            style={{
              padding: "8px 20px",
              fontSize: "1rem",
              borderRadius: "5px",
              backgroundColor: "#388E3B",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Ver Historial
          </button>
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

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            gap: "20px",
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Calidad del Aire</div>
            <div style={valueStyle}>
              {datos.CalidadAire !== null ? datos.CalidadAire : "Cargando..."}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Humedad (DHT11)</div>
            <div style={valueStyle}>
              {datos.HumedadDHT11 !== null
                ? `${datos.HumedadDHT11} %`
                : "Cargando..."}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Humedad del Suelo</div>
            <div style={valueStyle}>
              {datos.HumedadSuelo !== null
                ? `${datos.HumedadSuelo} %`
                : "Cargando..."}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Temperatura (DHT11)</div>
            <div style={valueStyle}>
              {datos.TemperaturaDHT11 !== null
                ? `${datos.TemperaturaDHT11} °C`
                : "Cargando..."}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Temperatura (DS18B20)</div>
            <div style={valueStyle}>
              {datos.TemperaturaDS18B20 !== null
                ? `${datos.TemperaturaDS18B20} °C`
                : "Cargando..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Monitoreo;