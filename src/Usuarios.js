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