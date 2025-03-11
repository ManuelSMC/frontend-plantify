import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
import userIcon from "./assets/person.png";
import lockIcon from "./assets/lock.png";

function App() {
  const [correo, setUsuario] = useState("");
  const [contraseña, setContrasena] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    try {
      //solicitud POST al backend
      const respuesta = await fetch("https://plantify.jamadev.com/index.php/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo: correo, contraseña: contraseña }), // enviar los datos al backend
      });

      const datos = await respuesta.json(); // Parseamos la respuesta a JSON

      if (respuesta.ok) {
        // Si la respuesta es OK, guardamos los datos del usuario en el localStorage o manejamos sesión
        alert("Inicio de sesión exitoso");
        navigate("/dashboard"); // Redirigimos al dashboard
      } else {
        // Si el login falla, mostramos un mensaje de error
        alert("Error: " + datos.message);
      }
    } catch (error) {
      alert("Error de conexión");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plantify</h1>
        <br />
        <img src={logo} alt="Logo" className="logo" />
        <br />

        <div className="input-container">
          <img src={userIcon} alt="Usuario" className="input-icon" />
          <input
            type="text"
            placeholder="Usuario"
            className="input-field"
            value={correo}
            onChange={(e) => setUsuario(e.target.value)} // Actualiza el estado del usuario
          />
        </div>

        <div className="password-container">
          <img src={lockIcon} alt="Contraseña" className="password-icon" />
          <input
            type="password"
            placeholder="Contraseña"
            className="input-field"
            value={contraseña}
            onChange={(e) => setContrasena(e.target.value)} // Actualiza el estado de la contraseña
          />
        </div>

        <button className="login-button" onClick={iniciarSesion}>Ingresar</button>
      </header>
    </div>
  );
}

export default App;
