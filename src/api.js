// src/api.js
const API_URL = "https://plantify.jamadev.com/index.php/usuarios";

export const fetchUsuarios = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener los usuarios");
  }
  const data = await response.json();
  return data.data || []; // Aseguramos que devuelva un arreglo si no hay datos
};

export const addUsuario = async (usuario) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error al agregar usuario");
  }
  return data.data; // Esto devuelve el objeto usuarioFormateado
};

export const updateUsuario = async (usuario) => {
  const response = await fetch(`${API_URL}/${usuario.id_usuario}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Error al actualizar usuario");
  }
  return data.data;
};

export const deleteUsuario = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al eliminar usuario");
  }
  return await response.json();
};