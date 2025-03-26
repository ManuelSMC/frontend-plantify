// src/components/Usuarios.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { fetchUsuarios, addUsuario, updateUsuario } from "./api";
import { FaEdit } from "react-icons/fa";

function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [usuarioAdd, setUsuarioAdd] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    tipo: 0,
    estatus: 1,
    contraseña: "",
  });
  const [message, setMessage] = useState("");
  const [errorContraseña, setErrorContraseña] = useState(""); // Estado para mensaje de error de contraseña

  // Validar autenticación y tipo de usuario al cargar el componente
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
      navigate("/"); // Redirigir al login si no hay usuario
    } else if (usuario.tipo !== 1) {
      navigate("/presentacion"); // Redirigir a presentación si no es administrador
    }
  }, [navigate]);

  // Fetch usuarios
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const data = await fetchUsuarios();
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setUsuarios([]);
        setMessage("Error al obtener los usuarios");
      }
    };
    obtenerUsuarios();
  }, []);

  const handleEdit = (usuario) => {
    setUsuarioEdit({ ...usuario });
    setModalEditVisible(true);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUsuario(usuarioEdit);
      setUsuarios(
        usuarios.map((usuario) =>
          usuario.id_usuario === updatedUser.id_usuario ? updatedUser : usuario
        )
      );
      setModalEditVisible(false);
      setMessage("Usuario actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      setMessage("Error al actualizar el usuario");
    }
  };

  // Validación de la contraseña
  const validarContraseña = (contraseña) => {
    const minLength = contraseña.length >= 8;
    const tieneNumero = /\d/.test(contraseña);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(contraseña);

    if (!minLength) return "La contraseña debe tener al menos 8 caracteres.";
    if (!tieneNumero) return "La contraseña debe contener al menos un número.";
    if (!tieneEspecial) return "La contraseña debe contener al menos un carácter especial (ej. !@#$%^&*).";
    return ""; // Si pasa todas las validaciones
  };

  const handleAddUsuario = async (e) => {
    e.preventDefault();

    // Validar la contraseña antes de enviar
    const error = validarContraseña(usuarioAdd.contraseña);
    if (error) {
      setErrorContraseña(error);
      return;
    }

    try {
      const response = await addUsuario(usuarioAdd);
      setUsuarios([...usuarios, response]);
      setModalAddVisible(false);
      setUsuarioAdd({
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        tipo: 0,
        estatus: 1,
        contraseña: "",
      });
      setErrorContraseña(""); // Limpiar error
      setMessage("Usuario agregado exitosamente");
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      setMessage("Error al agregar el usuario: " + error.message);
    }
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setUsuarioEdit({
      ...usuarioEdit,
      [name]: name === "tipo" || name === "estatus" ? parseInt(value, 10) : value,
    });
  };

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setUsuarioAdd({
      ...usuarioAdd,
      [name]: name === "tipo" || name === "estatus" ? parseInt(value, 10) : value,
    });
    // Validar contraseña en tiempo real mientras se escribe
    if (name === "contraseña") {
      const error = validarContraseña(value);
      setErrorContraseña(error);
    }
  };

  const getEstatus = (estatus) => (
    <span
      style={{
        padding: "5px 10px",
        backgroundColor: estatus === 1 ? "#D4EDDA" : "#F8D7DA",
        color: estatus === 1 ? "#155724" : "#721C24",
        borderRadius: "15px",
        fontSize: "0.85rem",
      }}
    >
      {estatus === 1 ? "Activo" : "Inactivo"}
    </span>
  );

  const getTipo = (tipo) => (
    <span
      style={{
        padding: "5px 10px",
        backgroundColor: "#E2E3E5",
        color: "#383D41",
        borderRadius: "15px",
        fontSize: "0.85rem",
      }}
    >
      {tipo === 1 ? "Administrador" : "Técnico"}
    </span>
  );

  const btnStyle = {
    padding: "5px 10px",
    fontSize: "0.9rem",
    borderRadius: "5px",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const btnEditStyle = { ...btnStyle, backgroundColor: "#FFC107", color: "black" };
  const modalCloseButton = {
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    color: "#888",
    cursor: "pointer",
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px 40px" }}>
        {message && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: message.includes("Error") ? "#F8D7DA" : "#D4EDDA",
              color: message.includes("Error") ? "#721C24" : "#155724",
              borderRadius: "5px",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ color: "#333", fontSize: "1.8rem", margin: 0 }}>
            Administrar Usuarios
          </h2>
          <button
            onClick={() => setModalAddVisible(true)}
            style={{
              padding: "8px 20px",
              fontSize: "1rem",
              borderRadius: "5px",
              backgroundColor: "#388E3B",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Añadir usuario
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#285A43",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    backgroundColor: "#285A43",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  Nombre
                </th>
                <th
                  style={{
                    backgroundColor: "#285A43",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  Apellido
                </th>
                <th
                  style={{
                    backgroundColor: "#285A43",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  Correo
                </th>
                <th
                  style={{
                    backgroundColor: "#285A43",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  Teléfono
                </th>
                <th
                  style={{
                    backgroundColor: "#285A43",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  Estatus
                </th>
                <th
                  style={{
                    backgroundColor: "#285A43",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  Tipo
                </th>
                <th
                  style={{
                    backgroundColor: "#285A43",
                    color: "white",
                    padding: "10px",
                    textAlign: "left",
                    fontSize: "0.9rem",
                  }}
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", color: "#888", padding: "20px" }}
                  >
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario}>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {usuario.id_usuario}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {usuario.nombre}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {usuario.apellido}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {usuario.correo}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {usuario.telefono}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {getEstatus(usuario.estatus)}
                    </td>
                    <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                      {getTipo(usuario.tipo)}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        gap: "5px",
                      }}
                    >
                      <button
                        onClick={() => handleEdit(usuario)}
                        style={btnEditStyle}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Editar Usuario */}
      {modalEditVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "400px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalEditVisible(false)}
              style={modalCloseButton}
            >
              X
            </button>
            <h3>Editar Usuario</h3>
            <form onSubmit={handleSaveChanges}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={usuarioEdit.nombre}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={usuarioEdit.apellido}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={usuarioEdit.correo}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={usuarioEdit.telefono}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={usuarioEdit.tipo}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={1}>Administrador</option>
                  <option value={0}>Técnico</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Estatus
                </label>
                <select
                  name="estatus"
                  value={usuarioEdit.estatus}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#388E3B",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Agregar Usuario */}
      {modalAddVisible && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "400px",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalAddVisible(false)}
              style={modalCloseButton}
            >
              X
            </button>
            <h3>Agregar Usuario</h3>
            <form onSubmit={handleAddUsuario}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={usuarioAdd.nombre}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={usuarioAdd.apellido}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={usuarioAdd.correo}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={usuarioAdd.telefono}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={usuarioAdd.tipo}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={1}>Administrador</option>
                  <option value={0}>Técnico</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Estatus
                </label>
                <select
                  name="estatus"
                  value={usuarioAdd.estatus}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", textAlign: "left" }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  name="contraseña"
                  value={usuarioAdd.contraseña}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "8px",
                    width: "100%",
                    borderRadius: "5px",
                    border: errorContraseña ? "1px solid #721C24" : "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                  required
                />
                {errorContraseña && (
                  <span
                    style={{
                      display: "block",
                      textAlign: "left",
                      color: "#721C24",
                      fontSize: "0.85rem",
                      marginTop: "5px",
                    }}
                  >
                    {errorContraseña}
                  </span>
                )}
              </div>
              <div>
                <button
                  type="submit"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#388E3B",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                  }}
                  disabled={!!errorContraseña} // Deshabilitar si hay error
                >
                  Agregar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;