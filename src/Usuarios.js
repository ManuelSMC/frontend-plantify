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

    const errores = validarCampos(usuarioEdit, true); // true indica que es edición
    if (errores) {
      setMessage(errores);
      return;
    }

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
      setMessage(`Error al actualizar el usuario: ${error.message}`);
    }
  };

  const validarCorreo = (correo) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(correo) ? "" : "El correo debe tener el formato xxx@x.x";
  };

  const validarContraseña = (contraseña) => {
    const minLength = contraseña.length >= 8;
    const tieneNumero = /\d/.test(contraseña);
    const tieneEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(contraseña);
    const tieneMayuscula = /[A-Z]/.test(contraseña); // Nueva validación: al menos una mayúscula

    let errores = [];
    if (!minLength) errores.push("La contraseña debe tener al menos 8 caracteres.");
    if (!tieneNumero) errores.push("La contraseña debe contener al menos un número.");
    if (!tieneEspecial) errores.push("La contraseña debe contener al menos un carácter especial (ej. !@#$%^&*).");
    if (!tieneMayuscula) errores.push("La contraseña debe contener al menos una mayúscula.");

    return errores.length > 0 ? errores.join(" ") : "";
  };

  const validarCampos = (data, isEditing = false) => {
    let errores = [];

    if (!data.nombre || data.nombre.trim() === "") {
      errores.push("El nombre es obligatorio.");
    }

    if (!data.apellido || data.apellido.trim() === "") {
      errores.push("El apellido es obligatorio.");
    }

    if (!data.correo || data.correo.trim() === "") {
      errores.push("El correo es obligatorio.");
    } else {
      const errorCorreo = validarCorreo(data.correo);
      if (errorCorreo) errores.push(errorCorreo);
    }

    if (!isEditing && (!data.contraseña || data.contraseña.trim() === "")) { // Solo para agregar
      errores.push("La contraseña es obligatoria.");
    } else if (!isEditing) { // Validar contraseña solo si se está agregando
      const errorContraseña = validarContraseña(data.contraseña);
      if (errorContraseña) errores.push(errorContraseña);
    }

    if (!data.telefono || data.telefono.trim() === "") {
      errores.push("El teléfono es obligatorio.");
    } else if (!/^\d+$/.test(data.telefono)) { // Solo números
      errores.push("El teléfono debe contener solo números.");
    }

    if (typeof data.tipo !== "number" || (data.tipo !== 0 && data.tipo !== 1)) {
      errores.push("El tipo de usuario es inválido.");
    }

    if (typeof data.estatus !== "number" || (data.estatus !== 0 && data.estatus !== 1)) {
      errores.push("El estatus es inválido.");
    }

    return errores.length > 0 ? errores.join(" ") : "";
  };

  // src/components/Usuarios.js (fragmento relevante)
  const handleAddUsuario = async (e) => {
    e.preventDefault();

    const errores = validarCampos(usuarioAdd);
    if (errores) {
      setErrorContraseña(errores);
      return;
    }

    try {
      const response = await addUsuario(usuarioAdd);
      if (response && response.id_usuario) {
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
        setErrorContraseña("");
        setMessage("Usuario agregado exitosamente");
      } else {
        throw new Error("Respuesta del servidor inválida");
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error.message);
      setMessage(`Error al agregar usuario: ${error.message}`);
    }
  };

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setUsuarioAdd({
      ...usuarioAdd,
      [name]: name === "tipo" || name === "estatus" ? parseInt(value, 10) : value,
    });

    // Validaciones en tiempo real
    if (name === "correo") {
      const errorCorreo = validarCorreo(value);
      setErrorContraseña(errorCorreo || "");
    } else if (name === "contraseña") {
      const errorContraseña = validarContraseña(value);
      setErrorContraseña(errorContraseña);
    } else if (name === "telefono" && value && !/^\d*$/.test(value)) {
      setErrorContraseña("El teléfono debe contener solo números.");
    } else {
      setErrorContraseña(""); // Limpiar errores si no hay problemas
    }
  };

  // Similarmente, actualiza handleChangeEdit si es necesario
  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setUsuarioEdit({
      ...usuarioEdit,
      [name]: name === "tipo" || name === "estatus" ? parseInt(value, 10) : value,
    });

    // Validación en tiempo real para edición (si aplica)
    if (name === "correo") {
      const errorCorreo = validarCorreo(value);
      setMessage(errorCorreo || "");
    } else if (name === "telefono" && value && !/^\d*$/.test(value)) {
      setMessage("El teléfono debe contener solo números.");
    } else {
      setMessage(""); // Limpiar mensajes si no hay errores
    }
  };

  const getEstatus = (estatus) => (
    <span
      style={{
        padding: "6px 12px",
        backgroundColor: estatus === 1 ? "#D1FAE5" : "#FEE2E2",
        color: estatus === 1 ? "#065F46" : "#B91C1C",
        borderRadius: "9999px",
        fontSize: "0.875rem",
        fontWeight: "500",
      }}
    >
      {estatus === 1 ? "Activo" : "Inactivo"}
    </span>
  );

  const getTipo = (tipo) => (
    <span
      style={{
        padding: "6px 12px",
        backgroundColor: "#E5E7EB",
        color: "#1F2937",
        borderRadius: "9999px",
        fontSize: "0.875rem",
        fontWeight: "500",
      }}
    >
      {tipo === 1 ? "Administrador" : "Técnico"}
    </span>
  );

  const btnStyle = {
    padding: "6px 12px",
    fontSize: "0.875rem",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "background-color 0.2s ease",
  };

  const btnEditStyle = { ...btnStyle, backgroundColor: "#FBBF24", color: "#1F2937" };

  const modalCloseButton = {
    position: "absolute",
    top: "12px",
    right: "12px",
    fontSize: "1.25rem",
    background: "none",
    border: "none",
    color: "#6B7280",
    cursor: "pointer",
    transition: "color 0.2s ease",
  };

  return (
    <div style={{ backgroundColor: "#F3F4F6", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ padding: "32px 64px", maxWidth: "1280px", margin: "0 auto" }}>
        {message && (
          <div
            style={{
              padding: "12px 16px",
              marginBottom: "24px",
              backgroundColor: message.includes("Error") ? "#FEE2E2" : "#D1FAE5",
              color: message.includes("Error") ? "#B91C1C" : "#065F46",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "500",
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
            marginBottom: "24px",
          }}
        >
          <h2 style={{ color: "#1F2937", fontSize: "1.875rem", fontWeight: "600", margin: 0 }}>
            Administrar Usuarios
          </h2>
          <button
            onClick={() => setModalAddVisible(true)}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "6px",
              backgroundColor: "#10B981",
              color: "white",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            Añadir usuario
          </button>
        </div>

        <div style={{ overflowX: "auto", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    borderTopLeftRadius: "8px",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Nombre
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Apellido
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Correo
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Teléfono
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Estatus
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                  }}
                >
                  Tipo
                </th>
                <th
                  style={{
                    backgroundColor: "#1F2937",
                    color: "white",
                    padding: "12px 16px",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    borderTopRightRadius: "8px",
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
                    style={{ textAlign: "center", color: "#6B7280", padding: "32px" }}
                  >
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((usuario, index) => (
                  <tr key={usuario.id_usuario} style={{ backgroundColor: index % 2 === 0 ? "#F9FAFB" : "white" }}>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {usuario.id_usuario}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {usuario.nombre}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {usuario.apellido}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {usuario.correo}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {usuario.telefono}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {getEstatus(usuario.estatus)}
                    </td>
                    <td style={{ padding: "12px 16px", borderBottom: "1px solid #E5E7EB" }}>
                      {getTipo(usuario.tipo)}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #E5E7EB",
                        display: "flex",
                        gap: "8px",
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
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              width: "450px",
              maxWidth: "90%",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalEditVisible(false)}
              style={modalCloseButton}
            >
              ×
            </button>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1F2937", marginBottom: "20px" }}>Editar Usuario</h3>
            <form onSubmit={handleSaveChanges}>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={usuarioEdit.nombre}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={usuarioEdit.apellido}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={usuarioEdit.correo}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={usuarioEdit.telefono}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={usuarioEdit.tipo}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <option value={1}>Administrador</option>
                  <option value={0}>Técnico</option>
                </select>
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Estatus
                </label>
                <select
                  name="estatus"
                  value={usuarioEdit.estatus}
                  onChange={handleChangeEdit}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
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
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: "500",
                    transition: "background-color 0.2s ease",
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
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              width: "450px",
              maxWidth: "90%",
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalAddVisible(false)}
              style={modalCloseButton}
            >
              ×
            </button>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1F2937", marginBottom: "20px" }}>Agregar Usuario</h3>
            <form onSubmit={handleAddUsuario}>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={usuarioAdd.nombre}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={usuarioAdd.apellido}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Correo
                </label>
                <input
                  type="email"
                  name="correo"
                  value={usuarioAdd.correo}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={usuarioAdd.telefono}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Tipo
                </label>
                <select
                  name="tipo"
                  value={usuarioAdd.tipo}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <option value={1}>Administrador</option>
                  <option value={0}>Técnico</option>
                </select>
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Estatus
                </label>
                <select
                  name="estatus"
                  value={usuarioAdd.estatus}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
              <div style={{ marginBottom: "16px", textAlign: "left" }}>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "#374151", marginBottom: "4px" }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  name="contraseña"
                  value={usuarioAdd.contraseña}
                  onChange={handleChangeAdd}
                  style={{
                    padding: "10px",
                    width: "100%",
                    borderRadius: "6px",
                    border: errorContraseña ? "1px solid #B91C1C" : "1px solid #D1D5DB",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  required
                />
                {errorContraseña && (
                  <span
                    style={{
                      display: "block",
                      textAlign: "left",
                      color: "#B91C1C",
                      fontSize: "0.75rem",
                      marginTop: "4px",
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
                    backgroundColor: "#10B981",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    width: "100%",
                    fontWeight: "500",
                    transition: "background-color 0.2s ease",
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