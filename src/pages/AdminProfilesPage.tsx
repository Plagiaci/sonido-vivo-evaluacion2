import { useState, type FormEvent } from "react";
import { Mensaje } from "../components/PageHelpers";
import { useStore, type Usuario } from "../context/StoreContext";

const regiones = [
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Biobío",
  "La Araucanía",
  "Los Lagos",
];

export function AdminProfilesPage() {
  const { usuarios, usuarioActual, guardarUsuarios } = useStore();
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );
  const notificar = (texto: string, tipo: "danger" | "success") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const agregarVendedor = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (usuarioActual?.rol !== "administrador") return;

    const formulario = new FormData(evento.currentTarget);
    const leer = (campo: string) => String(formulario.get(campo) ?? "").trim();
    const nombre = leer("nombre");
    const apellido = leer("apellido");
    const fechaNacimiento = leer("fechaNacimiento");
    const correo = leer("correo").toLowerCase();
    const password = String(formulario.get("password") ?? "");
    const confirmarPassword = String(formulario.get("confirmarPassword") ?? "");
    const direccion = leer("direccion");
    const region = leer("region");
    const genero = leer("genero");
    const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
    const hoy = new Date();
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    if (
      hoy.getMonth() < nacimiento.getMonth() ||
      (hoy.getMonth() === nacimiento.getMonth() &&
        hoy.getDate() < nacimiento.getDate())
    ) {
      edad -= 1;
    }

    if (
      !nombre ||
      !apellido ||
      !fechaNacimiento ||
      !direccion ||
      !region ||
      !genero
    ) {
      notificar("Completa todos los campos del usuario.", "danger");
      return;
    }
    if (nacimiento > hoy) {
      notificar(
        "La fecha de nacimiento no puede ser posterior a hoy.",
        "danger",
      );
      return;
    }
    if (edad < 14) {
      notificar("El usuario debe tener al menos 14 años.", "danger");
      return;
    }
    if (usuarios.some((usuario) => usuario.correo === correo)) {
      notificar("Ya existe una cuenta con ese correo.", "danger");
      return;
    }
    if (password.length < 8) {
      notificar("La contraseña debe tener mínimo 8 caracteres.", "danger");
      return;
    }
    if (password !== confirmarPassword) {
      notificar("Las contraseñas no coinciden.", "danger");
      return;
    }

    const nuevoUsuario: Usuario = {
      id: crypto.randomUUID(),
      nombre,
      apellido,
      fechaNacimiento,
      correo,
      password,
      direccion,
      region,
      genero,
      intentosFallidos: 0,
      bloqueado: false,
      rol: "vendedor",
    };
    guardarUsuarios([...usuarios, nuevoUsuario]);
    evento.currentTarget.reset();
    notificar("Vendedor agregado correctamente.", "success");
  };

  const eliminarUsuario = (usuario: Usuario) => {
    if (
      usuarioActual?.rol !== "administrador" ||
      usuario.id === usuarioActual.id
    ) {
      return;
    }
    if (
      usuario.rol === "administrador" &&
      usuarios.filter((item) => item.rol === "administrador").length <= 1
    ) {
      notificar("Debe existir al menos un administrador.", "danger");
      return;
    }
    if (
      !window.confirm(
        `¿Eliminar la cuenta de ${usuario.nombre} ${usuario.apellido}?`,
      )
    ) {
      return;
    }
    guardarUsuarios(usuarios.filter((item) => item.id !== usuario.id));
    notificar(
      `Se eliminó la cuenta de ${usuario.nombre} ${usuario.apellido}.`,
      "success",
    );
  };

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h2 className="h4 fw-bold mb-3">Administración de perfiles</h2>
        <Mensaje texto={mensaje} tipo={tipoMensaje} />
        <h3 className="h5 fw-bold mb-3">Agregar vendedor</h3>
        {/* <p className="text-secondary">
          Los clientes pueden crear sus propias cuentas desde «Registrarse».
        </p> */}
        <form onSubmit={agregarVendedor} className="mb-5">
          <div className="row g-3">
            {(
              [
                ["nombre", "Nombre", "text"],
                ["apellido", "Apellido", "text"],
                ["fechaNacimiento", "Fecha de nacimiento", "date"],
                ["correo", "Correo electrónico", "email"],
                ["password", "Contraseña", "password"],
                ["confirmarPassword", "Confirmar contraseña", "password"],
                ["direccion", "Dirección", "text"],
              ] as const
            ).map(([name, label, type]) => (
              <div className="col-md-6" key={name}>
                <label className="form-label" htmlFor={`usuario-${name}`}>
                  {label}
                </label>
                <input
                  className="form-control"
                  id={`usuario-${name}`}
                  name={name}
                  type={type}
                  min={type === "date" ? "1900-01-01" : undefined}
                  max={
                    type === "date"
                      ? new Date().toISOString().slice(0, 10)
                      : undefined
                  }
                  minLength={type === "password" ? 8 : undefined}
                  required
                />
              </div>
            ))}
            <div className="col-md-6">
              <label className="form-label" htmlFor="usuario-region">
                Región
              </label>
              <select
                className="form-select"
                id="usuario-region"
                name="region"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Selecciona una región
                </option>
                {regiones.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 offset-md-3">
              <label className="form-label" htmlFor="usuario-genero">
                Género
              </label>
              <select
                className="form-select"
                id="usuario-genero"
                name="genero"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                {["Masculino", "Femenino", "Otro", "Prefiero no indicar"].map(
                  (opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary mt-4" type="submit">
              Agregar vendedor
            </button>
          </div>
        </form>
        <h3 className="h5 fw-bold mb-3">Perfiles registrados</h3>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    {usuario.nombre} {usuario.apellido}
                  </td>
                  <td>{usuario.correo}</td>
                  <td>
                    {usuario.rol === "administrador"
                      ? "Administrador"
                      : usuario.rol === "vendedor"
                        ? "Vendedor"
                        : "Cliente"}
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      type="button"
                      disabled={usuario.id === usuarioActual?.id}
                      onClick={() => eliminarUsuario(usuario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
