import React, { useState } from "react";
import "./App.css"; 
import logo from "./assets/logo.png";
import userIcon from "./assets/person.png"; 
import lockIcon from "./assets/lock.png"; 

function App() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");

  const iniciarSesion = async () => {
    try {
      const respuesta = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usuario, contrasena }),
      });
      
      const datos = await respuesta.json();
      if (respuesta.ok) {
        alert("Inicio de sesión exitoso");
      } else {
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
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="password-container">
          <img src={lockIcon} alt="Contraseña" className="password-icon" />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="input-field"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={iniciarSesion}>Ingresar</button>
      </header>
    </div>
  );
}

export default App;
