import React, { useEffect, useState } from "react";

const UsuariosView = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch("https://www.gavilanes.com.mx/backendPlantify/index.php/usuarios")
    .then((response) => response.json())
    .then((data) => setUsuarios(data))
    .catch((error) => console.error("Error al obtener usuarios:", error));
  }, []);

  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id_usuario}>
            {usuario.nombre} {usuario.apellido} - {usuario.correo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuariosView; // ✅ Asegúrate de exportarlo correctamente
