import React from "react";
import UsuariosView from "./components/UsuariosView";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Usuarios de la Base de Datos</h1>
        <UsuariosView />
      </header>
    </div>
  );
}

export default App;
