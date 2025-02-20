import React from "react";
import UsuariosView from "./components/UsuariosView";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Prueba para proyecto Plantify - Obtener datos de base de datos en servidor</h1>
        <UsuariosView />
      </header>
    </div>
  );
}

export default App;
