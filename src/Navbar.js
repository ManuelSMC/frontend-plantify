// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {};
  const esAdministrador = usuario.tipo === 1;

  const handleLogout = async () => {
    try {
      await fetch("https://plantify.jamadev.com/index.php/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_usuario: usuario.id,
          session_token: usuario.session_token,
        }),
      });
      localStorage.removeItem("usuario");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      localStorage.removeItem("usuario");
      navigate("/");
    }
  };

  return (
    <nav
      style={{
        backgroundColor: "#285A43",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src={logo} alt="Logo" style={{ width: "40px" }} />
        <span
          style={{
            color: "white",
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginLeft: "10px",
          }}
        >
          Plantify
        </span>
      </div>
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          gap: "20px",
          margin: 0,
          padding: 0,
          alignItems: "center",
        }}
      >
        <li>
          <Link to="/presentacion" style={{ color: "white", textDecoration: "none" }}>
            Inicio
          </Link>
        </li>
        {esAdministrador && (
          <li>
            <Link to="/usuarios" style={{ color: "white", textDecoration: "none" }}>
              Usuarios
            </Link>
          </li>
        )}
        <li>
          <Link to="/historial-notificaciones" style={{ color: "white", textDecoration: "none" }}>
            Notificaciones
          </Link>
        </li>
        <li>
          <Link to="/monitoreo" style={{ color: "white", textDecoration: "none" }}>
            Monitoreo
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            style={{
              color: "white",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;