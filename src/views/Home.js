import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import { styles } from "../styles/HomeStyles";

function Home() {
  const [showPassword, ] = useState(false);
  const navigate = useNavigate(); // Inicializa la función de navegación

  const handleLogin = () => {
    navigate("/inicio"); // Redirige a la pantalla de inicio
  };

  return (
    <div style={styles.homeContainer}>
      <div style={styles.overlay}></div>
      <h1 style={styles.homeTitle}>Plantify</h1>
      
      <div style={styles.inputContainer}>
        <label style={styles.label} htmlFor="username">Usuario</label>
        <input style={styles.input} type="text" id="username" name="username" />
      </div>

      <div style={styles.inputContainer}>
        <label style={styles.label} htmlFor="password">Contraseña</label>
        <div style={styles.passwordWrapper}>
          <input
            style={styles.input}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
          />
        </div>
      </div>

      <button type="button" style={styles.submitButton} onClick={handleLogin}>
        Ingresar
      </button>
      <button type="button" style={styles.recoverButton}>
        Recuperar Contraseña
      </button>
    </div>
  );
}

export default Home;
