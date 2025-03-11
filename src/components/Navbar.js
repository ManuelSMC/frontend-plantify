import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles/NavbarStyles"; // Corrige la ruta de importación

const NavbarComponent = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.navbarBrand}>
          Plantify
        </Link>
        <div style={styles.navbarLinks}>
          <Link to="Inicio" style={styles.navLink}>Inicio</Link>
          <Link to="Usuarios" style={styles.navLink}>Usuarios</Link>
          <Link to="/Notificaciones" style={styles.navLink}>Notificaciones</Link>
          <Link to="/Monitoreo" style={styles.navLink}>Monitoreo</Link>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
