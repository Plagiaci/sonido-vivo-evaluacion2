import { useState, type FormEvent } from "react";
import { Mensaje } from "../components/PageHelpers";
import { useStore, type Usuario } from "../context/StoreContext";

export function Registro() {
  const { usuarios, guardarUsuarios } = useStore();
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const regiones = [
    "Valparaíso",
    "Metropolitana",
    "O'Higgins",
    "Maule",
    "Biobío",
    "La Araucanía",
    "Los Lagos",
  ];

  const registrar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    const valor = (campo: string) => String(formulario.get(campo) ?? "");
    const nombre = valor("nombre").trim();
    const apellido = valor("apellido").trim();
    const fechaNacimiento = valor("fechaNacimiento");
    const correo = valor("correo").trim().toLowerCase();
    const password = valor("password");
    const confirmarPassword = valor("confirmarPassword");
    const direccion = valor("direccion").trim();
    const region = valor("region");
    const genero = valor("genero");
    const hoy = new Date();
    const nacimiento = new Date(`${fechaNacimiento}T00:00:00`);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();
    if (
      diferenciaMes < 0 ||
      (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
      edad -= 1;
    }

    const errores: [boolean, string][] = [
      [!nombre, "El nombre es obligatorio."],
      [!apellido, "El apellido es obligatorio."],
      [!fechaNacimiento, "Debe ingresar la fecha de nacimiento."],
      [
        Boolean(fechaNacimiento) && nacimiento > hoy,
        "La fecha no puede ser posterior a hoy.",
      ],
      [
        Boolean(fechaNacimiento) && nacimiento <= hoy && edad < 14,
        "Debe tener al menos 14 años.",
      ],
      [!correo, "El correo es obligatorio."],
      [
        Boolean(correo) && !correo.includes("@"),
        "El correo debe tener un formato válido",
      ],
      [
        usuarios.some((usuario) => usuario.correo === correo),
        "Ya existe una cuenta con ese correo.",
      ],
      [!password, "La contraseña es obligatoria."],
      [
        Boolean(password) && password.length < 8,
        "La contraseña debe tener mínimo 8 caracteres.",
      ],
      [password !== confirmarPassword, "Las contraseñas no coinciden."],
      [!direccion, "La dirección es obligatoria."],
      [!region, "Debe seleccionar una región."],
      [!genero, "Debe seleccionar una opción de género."],
      [formulario.get("condiciones") !== "on", "Debe aceptar las condiciones."],
    ];
    const error = errores.find(([invalido]) => invalido)?.[1];
    if (error) {
      setExito(false);
      setMensaje(error);
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
      rol: "cliente",
    };
    guardarUsuarios([...usuarios, nuevoUsuario]);
    setExito(true);
    setMensaje("Usuario registrado correctamente.");
    evento.currentTarget.reset();
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <section className="mb-4 text-center">
            <span className="badge text-bg-secondary mb-3">Cuenta</span>
            <h1 className="display-6 fw-bold">Crear cuenta</h1>
          </section>
          <section className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={registrar}>
                <div className="row g-3">
                  <Campo label="Nombre" name="nombre" required />
                  <Campo label="Apellido" name="apellido" required />
                  <Campo
                    label="Fecha de nacimiento"
                    name="fechaNacimiento"
                    type="date"
                    required
                  />
                  <Campo
                    label="Correo electrónico"
                    name="correo"
                    type="email"
                    required
                  />
                  <Campo
                    label="Contraseña"
                    name="password"
                    type="password"
                    required
                  />
                  <Campo
                    label="Confirmar contraseña"
                    name="confirmarPassword"
                    type="password"
                    required
                  />
                  <Campo label="Dirección" name="direccion" required />
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="region">
                      Región
                    </label>
                    <select
                      className="form-select"
                      id="region"
                      name="region"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione una región
                      </option>
                      {regiones.map((region) => (
                        <option key={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="genero">
                      Género
                    </label>
                    <select
                      className="form-select"
                      id="genero"
                      name="genero"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Seleccione una opción
                      </option>
                      {[
                        "Masculino",
                        "Femenino",
                        "Otro",
                        "Prefiero no indicar",
                      ].map((opcion) => (
                        <option key={opcion}>{opcion}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        id="condiciones"
                        name="condiciones"
                        type="checkbox"
                      />
                      <label className="form-check-label" htmlFor="condiciones">
                        Acepto las condiciones
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-grid mt-4">
                  <button className="btn btn-primary btn-lg" type="submit">
                    Registrarse
                  </button>
                </div>
              </form>
              <Mensaje texto={mensaje} tipo={exito ? "success" : "danger"} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="col-md-6">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        className="form-control"
        id={name}
        name={name}
        type={type}
        required={required}
      />
    </div>
  );
}
