import React, { useState } from "react";
import { styles } from "../styles/UsuariosStyles";
import ToggleSwitch from "../components/ToggleSwitch"; // Importamos el switch

function Usuarios() {
  // Datos de ejemplo (puedes reemplazar con datos de tu API)
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      correo: "juan@example.com",
      numero: "123456789",
      division: "A",
      tipo: "Estudiante",
      estatus: true,
    },
    {
      id: 2,
      nombre: "María López",
      correo: "maria@example.com",
      numero: "987654321",
      division: "B",
      tipo: "Docente",
      estatus: false,
    },
    {
      id: 3,
      nombre: "Carlos Díaz",
      correo: "carlos@example.com",
      numero: "456789123",
      division: "C",
      tipo: "Estudiante",
      estatus: true,
    },
  ]);

  // Función para cambiar el estado del usuario
  const toggleEstatus = (index) => {
    const updatedUsuarios = [...usuarios];
    updatedUsuarios[index].estatus = !updatedUsuarios[index].estatus;
    setUsuarios(updatedUsuarios);
  };

  // Función para editar usuario
  const editarUsuario = (id) => {
    alert(`Editar usuario con ID: ${id}`);
    // Aquí puedes agregar lógica para abrir un modal o redirigir a otra página de edición.
  };

  // Función para agregar usuario
  const agregarUsuario = () => {
    alert("Agregar nuevo usuario");
    // Aquí puedes agregar lógica para abrir un modal o redirigir a otra página de creación.
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Usuarios</h1>
        <button style={styles.addButton} onClick={agregarUsuario}>
          Agregar Usuario
        </button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.row}>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Número</th>
            <th>División</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={usuario.id} style={styles.row}>
              <td>{usuario.nombre}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.numero}</td>
              <td>{usuario.division}</td>
              <td>{usuario.tipo}</td>
              <td style={styles.switchContainer}>
                <ToggleSwitch
                  checked={usuario.estatus}
                  onChange={() => toggleEstatus(index)}
                />
              </td>
              <td>
                <button style={styles.editButton} onClick={() => editarUsuario(usuario.id)}>
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;
