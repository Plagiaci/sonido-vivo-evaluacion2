import { Fragment, useState, type FormEvent } from "react";
import { Mensaje } from "../../components/PageHelpers";
import {
  useStore,
  type RolUsuario,
  type Usuario,
} from "../../context/StoreContext";

const regiones = [
  "Valparaíso",
  "Metropolitana",
  "O'Higgins",
  "Maule",
  "Biobío",
  "La Araucanía",
  "Los Lagos",
];
const generos = ["Masculino", "Femenino", "Otro", "Prefiero no indicar"];

type RolGestionado = Extract<RolUsuario, "cliente" | "vendedor">;

export function AdminUserManagement({
  rol,
  nombreRol,
}: {
  rol: RolGestionado;
  nombreRol: string;
}) {
  const { usuarios, usuarioActual, guardarUsuarios } = useStore();
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<string | null>(null);
  const usuariosGestionados = usuarios.filter((usuario) => usuario.rol === rol);
  const nombreRolPlural = rol === "cliente" ? "clientes" : "vendedores";
  const notificar = (texto: string, tipo: "danger" | "success") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const leerDatosPersonales = (formulario: FormData) => ({
    nombre: String(formulario.get("nombre") ?? "").trim(),
    apellido: String(formulario.get("apellido") ?? "").trim(),
    fechaNacimiento: String(formulario.get("fechaNacimiento") ?? ""),
    correo: String(formulario.get("correo") ?? "")
      .trim()
      .toLowerCase(),
    direccion: String(formulario.get("direccion") ?? "").trim(),
    region: String(formulario.get("region") ?? ""),
    genero: String(formulario.get("genero") ?? ""),
  });

  const validarDatos = (
    formulario: FormData,
    idExcluido?: string,
  ): ReturnType<typeof leerDatosPersonales> | null => {
    const datos = leerDatosPersonales(formulario);
    if (
      !datos.nombre ||
      !datos.apellido ||
      !datos.fechaNacimiento ||
      !datos.correo ||
      !datos.direccion ||
      !datos.region ||
      !datos.genero
    ) {
      notificar("Completa todos los campos del usuario.", "danger");
      return null;
    }
    if (!datos.correo.includes("@")) {
      notificar("El correo debe tener un formato válido.", "danger");
      return null;
    }

    const nacimiento = new Date(`${datos.fechaNacimiento}T00:00:00`);
    const hoy = new Date();
    if (Number.isNaN(nacimiento.getTime()) || nacimiento > hoy) {
      notificar("Ingresa una fecha de nacimiento válida.", "danger");
      return null;
    }
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    if (
      hoy.getMonth() < nacimiento.getMonth() ||
      (hoy.getMonth() === nacimiento.getMonth() &&
        hoy.getDate() < nacimiento.getDate())
    ) {
      edad -= 1;
    }
    if (edad < 14) {
      notificar("El usuario debe tener al menos 14 años.", "danger");
      return null;
    }
    if (
      usuarios.some(
        (usuario) =>
          usuario.id !== idExcluido &&
          usuario.correo.toLowerCase() === datos.correo,
      )
    ) {
      notificar("Ya existe una cuenta con ese correo.", "danger");
      return null;
    }
    if (!regiones.includes(datos.region) || !generos.includes(datos.genero)) {
      notificar("Selecciona una región y género válidos.", "danger");
      return null;
    }
    return datos;
  };

  const crearUsuario = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (usuarioActual?.rol !== "administrador") return;
    const formulario = new FormData(evento.currentTarget);
    const datos = validarDatos(formulario);
    if (!datos) return;

    const password = String(formulario.get("password") ?? "");
    const confirmarPassword = String(formulario.get("confirmarPassword") ?? "");
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
      ...datos,
      password,
      intentosFallidos: 0,
      bloqueado: false,
      rol,
    };
    guardarUsuarios([...usuarios, nuevoUsuario]);
    evento.currentTarget.reset();
    notificar(`${nombreRol} creado correctamente.`, "success");
  };

  const modificarUsuario = (
    evento: FormEvent<HTMLFormElement>,
    usuarioId: string,
  ) => {
    evento.preventDefault();
    if (usuarioActual?.rol !== "administrador") return;
    const usuarioOriginal = usuarios.find(
      (usuario) => usuario.id === usuarioId && usuario.rol === rol,
    );
    if (!usuarioOriginal) {
      notificar(
        `No se encontró el perfil de ${nombreRol.toLowerCase()}.`,
        "danger",
      );
      setUsuarioEnEdicion(null);
      return;
    }

    const datos = validarDatos(new FormData(evento.currentTarget), usuarioId);
    if (!datos) return;
    const usuarioActualizado: Usuario = { ...usuarioOriginal, ...datos };
    guardarUsuarios(
      usuarios.map((usuario) =>
        usuario.id === usuarioId ? usuarioActualizado : usuario,
      ),
    );
    setUsuarioEnEdicion(null);
    notificar("Perfil actualizado correctamente.", "success");
  };

  const eliminarUsuario = (usuario: Usuario) => {
    if (usuarioActual?.rol !== "administrador" || usuario.rol !== rol) return;
    if (
      !window.confirm(
        `¿Eliminar la cuenta de ${usuario.nombre} ${usuario.apellido}?`,
      )
    ) {
      return;
    }
    guardarUsuarios(usuarios.filter((item) => item.id !== usuario.id));
    if (usuarioEnEdicion === usuario.id) setUsuarioEnEdicion(null);
    notificar(
      `Se eliminó la cuenta de ${usuario.nombre} ${usuario.apellido}.`,
      "success",
    );
  };

  const prefijo = rol;

  return (
    <section className="card shadow-sm border-0 mb-4">
      <div className="card-body p-4">
        <h3 className="h5 fw-bold mb-3">Gestión de {nombreRolPlural}</h3>
        <Mensaje texto={mensaje} tipo={tipoMensaje} />
        <details className="mb-4">
          <summary className="btn btn-outline-primary">
            Crear {nombreRol.toLowerCase()}
          </summary>
          <form className="row g-3 pt-3" onSubmit={crearUsuario}>
            <CamposPersonales prefijo={prefijo} />
            <div className="col-md-6">
              <label className="form-label" htmlFor={`${prefijo}-password`}>
                Contraseña
              </label>
              <input
                className="form-control"
                id={`${prefijo}-password`}
                name="password"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="col-md-6">
              <label
                className="form-label"
                htmlFor={`${prefijo}-confirmar-password`}
              >
                Confirmar contraseña
              </label>
              <input
                className="form-control"
                id={`${prefijo}-confirmar-password`}
                name="confirmarPassword"
                type="password"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="col-12">
              <button className="btn btn-primary" type="submit">
                Guardar {nombreRol.toLowerCase()}
              </button>
            </div>
          </form>
        </details>

        {usuariosGestionados.length === 0 ? (
          <p className="text-secondary mb-0">
            No hay perfiles de {nombreRolPlural} registrados.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Datos del perfil</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosGestionados.map((usuario) => (
                  <Fragment key={usuario.id}>
                    <tr>
                      <td>
                        {usuario.nombre} {usuario.apellido}
                      </td>
                      <td>{usuario.correo}</td>
                      <td>
                        <details>
                          <summary className="text-primary">Ver datos</summary>
                          <div className="small mt-2">
                            <p className="mb-1">
                              <strong>Fecha de nacimiento:</strong>{" "}
                              {usuario.fechaNacimiento}
                            </p>
                            <p className="mb-1">
                              <strong>Dirección:</strong> {usuario.direccion}
                            </p>
                            <p className="mb-1">
                              <strong>Región:</strong> {usuario.region}
                            </p>
                            <p className="mb-1">
                              <strong>Género:</strong> {usuario.genero}
                            </p>
                            <p className="mb-0">
                              <strong>Estado:</strong>{" "}
                              {usuario.bloqueado ? "Bloqueado" : "Activo"}
                            </p>
                          </div>
                        </details>
                      </td>
                      <td className="text-nowrap">
                        <button
                          className="btn btn-outline-primary btn-sm me-2"
                          type="button"
                          onClick={() =>
                            setUsuarioEnEdicion(
                              usuarioEnEdicion === usuario.id
                                ? null
                                : usuario.id,
                            )
                          }
                        >
                          {usuarioEnEdicion === usuario.id
                            ? "Cancelar"
                            : "Modificar"}
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          type="button"
                          onClick={() => eliminarUsuario(usuario)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                    {usuarioEnEdicion === usuario.id && (
                      <tr>
                        <td colSpan={4}>
                          <form
                            className="row g-3 py-2"
                            onSubmit={(evento) =>
                              modificarUsuario(evento, usuario.id)
                            }
                          >
                            <CamposPersonales
                              prefijo={`editar-${usuario.id}`}
                              usuario={usuario}
                            />
                            <div className="col-12">
                              <button className="btn btn-primary" type="submit">
                                Guardar cambios
                              </button>
                            </div>
                          </form>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

function CamposPersonales({
  prefijo,
  usuario,
}: {
  prefijo: string;
  usuario?: Usuario;
}) {
  const campos = [
    ["nombre", "Nombre", "text", usuario?.nombre ?? ""],
    ["apellido", "Apellido", "text", usuario?.apellido ?? ""],
    [
      "fechaNacimiento",
      "Fecha de nacimiento",
      "date",
      usuario?.fechaNacimiento ?? "",
    ],
    ["correo", "Correo electrónico", "email", usuario?.correo ?? ""],
    ["direccion", "Dirección", "text", usuario?.direccion ?? ""],
  ] as const;

  return (
    <>
      {campos.map(([name, label, type, value]) => {
        const id = `${prefijo}-${name}`;
        return (
          <div className="col-md-6" key={name}>
            <label className="form-label" htmlFor={id}>
              {label}
            </label>
            <input
              className="form-control"
              id={id}
              name={name}
              type={type}
              defaultValue={value}
              min={type === "date" ? "1900-01-01" : undefined}
              max={
                type === "date"
                  ? new Date().toISOString().slice(0, 10)
                  : undefined
              }
              autoComplete={name === "correo" ? "email" : undefined}
              required
            />
          </div>
        );
      })}
      <div className="col-md-6">
        <label className="form-label" htmlFor={`${prefijo}-region`}>
          Región
        </label>
        <select
          className="form-select"
          id={`${prefijo}-region`}
          name="region"
          defaultValue={usuario?.region ?? ""}
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
      <div className="col-md-6">
        <label className="form-label" htmlFor={`${prefijo}-genero`}>
          Género
        </label>
        <select
          className="form-select"
          id={`${prefijo}-genero`}
          name="genero"
          defaultValue={usuario?.genero ?? ""}
          required
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {generos.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
