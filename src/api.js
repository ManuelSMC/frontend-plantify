// api.js
const API_URL = "https://plantify.jamadev.com/index.php/usuarios";

export const fetchUsuarios = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }
  const data = await response.json();
  return data.data;
};

export const addUsuario = async (usuario) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    if (!response.ok) {
      throw new Error("Error al agregar usuario");
    }
    const data = await response.json();
    return data.data;
  };

export const updateUsuario = async (usuario) => {
  const response = await fetch(`${API_URL}/${usuario.id_usuario}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario), // Envía tipo como 0 o 1
  });
  if (!response.ok) {
    throw new Error("Error al actualizar usuario");
  }
  const data = await response.json();
  return data.data;
};

export const deleteUsuario = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error al eliminar usuario");
  }
  return await response.json();
};