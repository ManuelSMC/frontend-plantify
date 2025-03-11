import React, { useState, useEffect } from "react";
import modalStyles from "../styles/ModalEditStyles";

const ModalEditar = ({ isOpen, onClose, usuario, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    contraseña: "",
    telefono: "",
    tipoUsuario: "",
  });

  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Editar Usuario</h2>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          style={modalStyles.input}
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          style={modalStyles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={modalStyles.input}
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          style={modalStyles.input}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
          style={modalStyles.input}
        />
        <input
          type="text"
          name="tipoUsuario"
          placeholder="Tipo de Usuario"
          value={formData.tipoUsuario}
          onChange={handleChange}
          style={modalStyles.input}
        />
        <button style={modalStyles.button} onClick={handleSubmit}>Guardar</button>
        <button style={{ ...modalStyles.button, ...modalStyles.closeButton }} onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalEditar;
