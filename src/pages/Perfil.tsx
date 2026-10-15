import { useState } from "react";
import { useStore } from "../context/StoreContext";

export function Perfil() {
  const { usuarioActual } = useStore();
  const [nombre, setNombre] = useState(usuarioActual?.nombre ?? "");

  if (!usuarioActual) {
    return (
      <main className="container py-5">
        <h1>No hay usuario conectado</h1>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <h1>Mi perfil</h1>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label fw-bold">
          Nombre
        </label>

        <input
          id="nombre"
          type="text"
          className="form-control"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
        />
      </div>
      <p>
        <strong>Apellido:</strong> {usuarioActual.apellido}
      </p>

      <p>
        <strong>Correo:</strong> {usuarioActual.correo}
      </p>

      <p>
        <strong>Dirección:</strong> {usuarioActual.direccion}
      </p>

      <p>
        <strong>Región:</strong> {usuarioActual.region}
      </p>

      <p>
        <strong>Rol:</strong> {usuarioActual.rol}
      </p>
    </main>
  );
}
