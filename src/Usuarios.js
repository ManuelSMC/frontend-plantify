import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';
import { fetchUsuarios, addUsuario, updateUsuario, deleteUsuario } from './api'; // Importa las funciones de API

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalAddVisible, setModalAddVisible] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [usuarioAdd, setUsuarioAdd] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
  });

  // Fetch usuarios al cargar el componente
  useEffect(() => {
    const obtenerUsuarios = async () => {
      const data = await fetchUsuarios();
      setUsuarios(data);
    };

    obtenerUsuarios();
  }, []);

  const handleEliminar = (id) => {
    setUsuarioAEliminar(id);
    setModalVisible(true);
  };

  const confirmarEliminacion = async () => {
    await deleteUsuario(usuarioAEliminar);
    setUsuarios(usuarios.filter((usuario) => usuario.id_usuario !== usuarioAEliminar));
    setModalVisible(false);
  };

  const cancelarEliminacion = () => {
    setModalVisible(false);
    setUsuarioAEliminar(null);
  };

  const handleEdit = (usuario) => {
    setUsuarioEdit(usuario);
    setModalEditVisible(true);
  };

  const handleSaveChanges = async () => {
    await updateUsuario(usuarioEdit);
    setUsuarios(
      usuarios.map((usuario) =>
        usuario.id_usuario === usuarioEdit.id_usuario ? usuarioEdit : usuario
      )
    );
    setModalEditVisible(false);
  };

  const handleAddUsuario = async () => {
    const newUser = {
      id_usuario: usuarios.length + 1,
      tipo: 0,
      ...usuarioAdd,
      estatus: 1,
    };
    await addUsuario(newUser);
    setUsuarios([...usuarios, newUser]);
    setModalAddVisible(false);
    setUsuarioAdd({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
    });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setUsuarioEdit({ ...usuarioEdit, [name]: value });
  };

  const handleChangeAdd = (e) => {
    const { name, value } = e.target;
    setUsuarioAdd({ ...usuarioAdd, [name]: value });
  };

  const getEstatus = (estatus) => (
    <div
      style={{
        display: 'inline-block',
        padding: '5px 15px',
        backgroundColor: estatus === 1 ? '#E8F5E9' : '#FFC5C5',
        color: estatus === 1 ? '#008767' : '#DF0404',
        borderRadius: '20px',
      }}
    >
      {estatus === 1 ? 'Activo' : 'Inactivo'}
    </div>
  );

  const getTipo = (tipo) => (tipo === 1 ? 'Administrador' : 'Técnico');

  const btnStyle = {
    padding: '8px 15px',
    fontSize: '0.9rem',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    margin: '2px',
  };

  const btnEditStyle = {
    ...btnStyle,
    backgroundColor: '#FFC107',
    color: 'black',
  };

  const btnDeleteStyle = {
    ...btnStyle,
    backgroundColor: '#DC3545',
    color: 'white',
  };

  const modalCloseButton = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
  };

  return (
    <div>
      {/* Navbar */}
      <nav style={{ backgroundColor: '#285A43', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ width: '60px',paddingLeft:'65px' }} />
          <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginLeft: '10px' }}>Plantify</span>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', gap: '20px', marginRight: '66px' }}>
          <li><Link to="/presentacion" style={{ color: 'white', textDecoration: 'none' }}>Inicio</Link></li>
          <li><Link to="/usuarios" style={{ color: 'white', textDecoration: 'none' }}>Usuarios</Link></li>
          <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Notificaciones</a></li>
          <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Monitoreo</a></li>
        </ul>
      </nav>

      <div style={{ marginTop: '5rem', marginLeft: '60px', marginRight: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: '#285A43', fontSize: '2rem', margin: 0 }}>Administrar Usuarios</h2>
          <button onClick={() => setModalAddVisible(true)} style={{ padding: '10px 20px', fontSize: '1rem', borderRadius: '5px', backgroundColor: '#388E3B', color: 'white' }}>
            Agregar Usuario
          </button>
        </div>

        {/* Tabla de usuarios */}
        <table style={{ borderCollapse: 'collapse', width: '90%', margin: '0 auto', maxWidth: '1200px' }}>
          <thead>
            <tr>
              <th style={{ backgroundColor: '#285A43', color: 'white', padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ backgroundColor: '#285A43', color: 'white', padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ backgroundColor: '#285A43', color: 'white', padding: '12px', textAlign: 'left' }}>Apellido</th>
              <th style={{ backgroundColor: '#285A43', color: 'white', padding: '12px', textAlign: 'left' }}>Correo</th>
              <th style={{ backgroundColor: '#285A43', color: 'white', padding: '12px', textAlign: 'left' }}>Teléfono</th>
              <th style={{ backgroundColor: '#285A43', color: 'white', padding: '12px', textAlign: 'left' }}>Estatus</th>
              <th style={{ backgroundColor: '#285A43', color: 'white', padding: '12px', textAlign: 'left' }}>Tipo</th>
              <th style={{ backgroundColor: '#285A43', color: 'white', padding: '12px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: '#888', padding: '12px' }}>No hay usuarios registrados.</td>
              </tr>
            ) : (
              usuarios.map((usuario) => (
                <tr key={usuario.id_usuario}>
                  <td style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>{usuario.id_usuario}</td>
                  <td style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>{usuario.nombre}</td>
                  <td style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>{usuario.apellido}</td>
                  <td style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>{usuario.correo}</td>
                  <td style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>{usuario.telefono}</td>
                  <td style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>{getEstatus(usuario.estatus)}</td>
                  <td style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>{getTipo(usuario.tipo)}</td>
                  <td style={{ padding: '12px', backgroundColor: '#f9f9f9', display: 'flex', gap: '5px' }}>
                    <button onClick={() => handleEdit(usuario)} style={btnEditStyle}>Editar</button>
                    <button onClick={() => handleEliminar(usuario.id_usuario)} style={btnDeleteStyle}>Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación de eliminación */}
      {modalVisible && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '400px',
            textAlign: 'center',
          }}>
            <h3>¿Estás seguro de que deseas eliminar este usuario?</h3>
            <div style={{ marginTop: '20px' }}>
              <button onClick={confirmarEliminacion} style={{
                padding: '8px 20px',
                fontSize: '1rem',
                backgroundColor: '#DC3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
              }}>
                Sí, Eliminar
              </button>
              <button onClick={cancelarEliminacion} style={{
                padding: '8px 20px',
                fontSize: '1rem',
                backgroundColor: '#6C757D',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Usuario */}
      {modalEditVisible && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '400px',
            textAlign: 'center',
            position: 'relative',
          }}>
            <button
              onClick={() => setModalEditVisible(false)}
              style={modalCloseButton}
            >
              X
            </button>
            <h3>Editar Usuario</h3>
            <form onSubmit={handleSaveChanges}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={usuarioEdit.nombre}
                  onChange={handleChangeEdit}
                  style={{ padding: '8px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={usuarioEdit.apellido}
                  onChange={handleChangeEdit}
                  style={{ padding: '8px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={usuarioEdit.correo}
                  onChange={handleChangeEdit}
                  style={{ padding: '8px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={usuarioEdit.telefono}
                  onChange={handleChangeEdit}
                  style={{ padding: '8px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <button type="submit" style={{
                  padding: '10px 20px',
                  backgroundColor: '#388E3B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}>
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de agregar Usuario */}
      {modalAddVisible && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '400px',
            textAlign: 'center',
            position: 'relative',
          }}>
            <button
              onClick={() => setModalAddVisible(false)}
              style={modalCloseButton}
            >
              X
            </button>
            <h3>Agregar Usuario</h3>
            <form onSubmit={handleAddUsuario}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={usuarioAdd.nombre}
                  onChange={handleChangeAdd}
                  style={{ padding: '8px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={usuarioAdd.apellido}
                  onChange={handleChangeAdd}
                  style={{ padding: '8px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={usuarioAdd.correo}
                  onChange={handleChangeAdd}
                  style={{ padding: '8px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block' }}>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={usuarioAdd.telefono}
                  onChange={handleChangeAdd}
                  style={{ padding: '8px', width: '80%', borderRadius: '5px', border: '1px solid #ccc' }}
                />
              </div>
              <div>
                <button type="submit" style={{
                  padding: '10px 20px',
                  backgroundColor: '#388E3B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}>
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
