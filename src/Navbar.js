import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logoPlantifi.png";

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
    <nav className="bg-green-700 text-white py-4 px-6 flex justify-between items-center shadow-lg">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
        <span className="text-2xl font-bold tracking-tight">Plantify</span>
      </div>
      <ul className="flex items-center space-x-6">
        <li>
          <Link
            to="/presentacion"
            className="text-white hover:text-green-200 transition-colors duration-200 text-lg"
          >
            Inicio
          </Link>
        </li>
        {esAdministrador && (
          <li>
            <Link
              to="/usuarios"
              className="text-white hover:text-green-200 transition-colors duration-200 text-lg"
            >
              Usuarios
            </Link>
          </li>
        )}
        <li>
          <Link
            to="/historial-notificaciones"
            className="text-white hover:text-green-200 transition-colors duration-200 text-lg"
          >
            Notificaciones
          </Link>
        </li>
        <li>
          <Link
            to="/monitoreo"
            className="text-white hover:text-green-200 transition-colors duration-200 text-lg"
          >
            Monitoreo
          </Link>
        </li>
        <li>
          <Link
            to="/reportes"
            className="text-white hover:text-green-200 transition-colors duration-200 text-lg"
          >
            Reportes
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="text-white bg-green-800 hover:bg-green-600 transition-colors duration-200 px-4 py-2 rounded-md text-lg font-medium"
          >
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;