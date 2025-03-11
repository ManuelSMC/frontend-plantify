import React, { useState } from "react";
import { styles } from "../styles/UsuariosStyles";
import ToggleSwitch from "../components/ToggleSwitch";
import ModalEditar from "../components/ModalEditar"; // Importamos el modal

function Usuarios() {
  // Datos de ejemplo
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

  // Estado para modal de edición
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Función para cambiar estado del usuario
  const toggleEstatus = (index) => {
    const updatedUsuarios = [...usuarios];
    updatedUsuarios[index].estatus = !updatedUsuarios[index].estatus;
    setUsuarios(updatedUsuarios);
  };

  // Función para abrir modal de edición
  const editarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalOpen(true);
  };

  // Función para guardar cambios del usuario editado
  const guardarUsuario = (usuarioActualizado) => {
    const updatedUsuarios = usuarios.map((u) =>
      u.id === usuarioActualizado.id ? usuarioActualizado : u
    );
    setUsuarios(updatedUsuarios);
  };

  // Función para agregar usuario
  const agregarUsuario = () => {
    alert("Agregar nuevo usuario");
    // Aquí podrías abrir otro modal o redirigir a otro formulario
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
            <th style={styles.tableHeader}>Nombre</th>
            <th style={styles.tableHeader}>Correo</th>
            <th style={styles.tableHeader}>Número</th>
            <th style={styles.tableHeader}>División</th>
            <th style={styles.tableHeader}>Tipo</th>
            <th style={styles.tableHeader}>Estado</th>
            <th style={styles.tableHeader}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, index) => (
            <tr key={usuario.id} style={styles.row}>
              <td style={styles.tableCell}>{usuario.nombre}</td>
              <td style={styles.tableCell}>{usuario.correo}</td>
              <td style={styles.tableCell}>{usuario.numero}</td>
              <td style={styles.tableCell}>{usuario.division}</td>
              <td style={styles.tableCell}>{usuario.tipo}</td>
              <td style={styles.tableCell}>
                <div style={styles.switchContainer}>
                  <ToggleSwitch
                    checked={usuario.estatus}
                    onChange={() => toggleEstatus(index)}
                  />
                </div>
              </td>
              <td style={styles.tableCell}>
                <button
                  style={styles.editButton}
                  onClick={() => editarUsuario(usuario)}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar usuario */}
      <ModalEditar
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        usuario={usuarioSeleccionado}
        onSave={guardarUsuario}
      />
    </div>
  );
}

export default Usuarios;
