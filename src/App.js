import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
import userIcon from "./assets/person.png";
import lockIcon from "./assets/lock.png";

function App() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Estado para manejar errores
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    try {
      const respuesta = await fetch("http://localhost/backendPlantify/index.php/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          correo: correo,
          password: password,
        }),
      });

      const datos = await respuesta.json();

      if (respuesta.ok && datos.status === "success") {
        localStorage.setItem("usuario", JSON.stringify(datos.usuario));
        setErrorMessage(""); // Limpiar mensaje de error
        navigate("/presentacion");
      } else {
        setErrorMessage(datos.message); // Mostrar mensaje del backend (ej. "Ya existe una sesión activa")
      }
    } catch (error) {
      setErrorMessage("Error de conexión: " + error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plantify</h1>
        <br />
        <img src={logo} alt="Logo" className="logo" />
        <br />

        {errorMessage && (
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
            {errorMessage}
          </div>
        )}

        <div className="input-container">
          <img src={userIcon} alt="Usuario" className="input-icon" />
          <input
            type="text"
            placeholder="Correo"
            className="input-field"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </div>

        <div className="password-container">
          <img src={lockIcon} alt="password" className="password-icon" />
          <input
            type="password"
            placeholder="Contraseña"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={iniciarSesion}>
          Ingresar
        </button>
      </header>
    </div>
  );
}

export default App;