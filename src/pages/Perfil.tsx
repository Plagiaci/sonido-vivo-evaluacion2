import { useState, type FormEvent } from "react";
import { Mensaje } from "../components/PageHelpers";
import { useStore } from "../context/StoreContext";

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

export function Perfil() {
  const { usuarioActual, usuarios, guardarUsuarios } = useStore();
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );

  if (!usuarioActual) {
    return (
      <main className="container py-5">
        <h1>No hay usuario conectado</h1>
      </main>
    );
  }

  const guardarPerfil = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    const leer = (campo: string) =>
      String(formulario.get(campo) ?? "").trim();
    const nombre = leer("nombre");
    const apellido = leer("apellido");
    const fechaNacimiento = leer("fechaNacimiento");
    const correo = leer("correo").toLowerCase();
    const direccion = leer("direccion");
    const region = leer("region");
    const genero = leer("genero");

    if (
      !nombre ||
      !apellido ||
      !fechaNacimiento ||
      !correo ||
      !direccion ||
      !region ||
      !genero
    ) {
      setTipoMensaje("danger");
      setMensaje("Completa todos los campos del perfil.");
      return;
    }

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
    if (Number.isNaN(nacimiento.getTime()) || nacimiento > hoy) {
      setTipoMensaje("danger");
      setMensaje("La fecha de nacimiento no es válida.");
      return;
    }
    if (edad < 14) {
      setTipoMensaje("danger");
      setMensaje("Debes tener al menos 14 años.");
      return;
    }
    if (
      usuarios.some(
        (usuario) =>
          usuario.id !== usuarioActual.id &&
          usuario.correo.toLowerCase() === correo,
      )
    ) {
      setTipoMensaje("danger");
      setMensaje("Ya existe una cuenta con ese correo.");
      return;
    }

    guardarUsuarios(
      usuarios.map((usuario) =>
        usuario.id === usuarioActual.id
          ? {
              ...usuario,
              nombre,
              apellido,
              fechaNacimiento,
              correo,
              direccion,
              region,
              genero,
            }
          : usuario,
      ),
    );
    setTipoMensaje("success");
    setMensaje("Tu perfil se actualizó correctamente.");
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <section className="mb-4">
            <span className="badge text-bg-secondary mb-3">Cuenta</span>
            <h1 className="display-6 fw-bold">Mi perfil</h1>
            <p className="text-secondary">
              Actualiza tus datos personales. El rol de tu cuenta no se puede
              cambiar desde aquí.
            </p>
          </section>
          <section className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <form key={usuarioActual.id} onSubmit={guardarPerfil}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="perfil-nombre">
                      Nombre
                    </label>
                    <input
                      className="form-control"
                      id="perfil-nombre"
                      name="nombre"
                      defaultValue={usuarioActual.nombre}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="perfil-apellido">
                      Apellido
                    </label>
                    <input
                      className="form-control"
                      id="perfil-apellido"
                      name="apellido"
                      defaultValue={usuarioActual.apellido}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label
                      className="form-label"
                      htmlFor="perfil-fechaNacimiento"
                    >
                      Fecha de nacimiento
                    </label>
                    <input
                      className="form-control"
                      id="perfil-fechaNacimiento"
                      name="fechaNacimiento"
                      type="date"
                      max={new Date().toISOString().slice(0, 10)}
                      defaultValue={usuarioActual.fechaNacimiento}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="perfil-correo">
                      Correo electrónico
                    </label>
                    <input
                      className="form-control"
                      id="perfil-correo"
                      name="correo"
                      type="email"
                      defaultValue={usuarioActual.correo}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="perfil-direccion">
                      Dirección
                    </label>
                    <input
                      className="form-control"
                      id="perfil-direccion"
                      name="direccion"
                      defaultValue={usuarioActual.direccion}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="perfil-region">
                      Región
                    </label>
                    <select
                      className="form-select"
                      id="perfil-region"
                      name="region"
                      defaultValue={usuarioActual.region}
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
                    <label className="form-label" htmlFor="perfil-genero">
                      Género
                    </label>
                    <select
                      className="form-select"
                      id="perfil-genero"
                      name="genero"
                      defaultValue={usuarioActual.genero}
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
                  {/* <div className="col-md-12">
                    <label className="form-label" htmlFor="perfil-rol">
                      Rol
                    </label>
                    <input
                      className="form-control"
                      id="perfil-rol"
                      value={usuarioActual.rol}
                      readOnly
                    />
                  </div> */}
                </div>
                <button className="btn btn-primary mt-4" type="submit">
                  Guardar cambios
                </button>
              </form>
              <Mensaje texto={mensaje} tipo={tipoMensaje} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
