import React from "react";
import { styles } from "../styles/InicioStyles"; // Importa los estilos desde InicioStyles.js

function Inicio() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Nosotros</h1>
      <p style={styles.description}>
        Plantify es una empresa dedicada a la venta de plantas y productos relacionados con la jardinería. 
        Nuestro objetivo es proporcionar a nuestros clientes las mejores plantas y herramientas para que 
        puedan disfrutar de un entorno verde y saludable.
      </p>
    </div>
  );
}

export default Inicio;