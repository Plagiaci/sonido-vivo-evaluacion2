import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mensaje } from "../components/PageHelpers";
import { useStore } from "../context/StoreContext";

export function Login() {
  const { usuarios, guardarUsuarios, establecerSesion } = useStore();
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    const correo = String(formulario.get("correo") ?? "").trim().toLowerCase();
    const password = String(formulario.get("password") ?? "");
    if (!correo) return setMensaje("Debe ingresar su correo.");
    if (!password) return setMensaje("Debe ingresar su contraseña.");

    const actualizados = usuarios.map((usuario) => ({ ...usuario }));
    const usuario = actualizados.find((item) => item.correo === correo);
    if (!usuario) return setMensaje("Correo o contraseña incorrectos.");
    if (usuario.bloqueado) {
      return setMensaje("La cuenta se encuentra bloqueada.");
    }
    if (usuario.password !== password) {
      usuario.intentosFallidos += 1;
      if (usuario.intentosFallidos >= 3) {
        usuario.bloqueado = true;
        guardarUsuarios(actualizados);
        return setMensaje(
          "Cuenta bloqueada por alcanzar 3 intentos fallidos.",
        );
      }
      guardarUsuarios(actualizados);
      return setMensaje(
        `Correo o contraseña incorrectos. Intentos restantes: ${
          3 - usuario.intentosFallidos
        }`,
      );
    }

    usuario.intentosFallidos = 0;
    guardarUsuarios(actualizados);
    establecerSesion(usuario.id);
    navigate(usuario.rol === "cliente" ? "/catalogo" : "/gestion");
    evento.currentTarget.reset();
  };

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-5">
          <section className="mb-4 text-center">
            <span className="badge text-bg-secondary mb-3">Acceso</span>
            <h1 className="display-6 fw-bold">Iniciar sesión</h1>
            <p className="text-secondary">
              Ingresa con tu correo y contraseña.
            </p>
          </section>
          <section className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={iniciarSesion}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="correo">
                    Correo electrónico
                  </label>
                  <input
                    className="form-control"
                    id="correo"
                    name="correo"
                    type="email"
                    autoComplete="email"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Contraseña
                  </label>
                  <input
                    className="form-control"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                  />
                </div>
                <div className="d-grid mt-4">
                  <button className="btn btn-primary btn-lg" type="submit">
                    Ingresar
                  </button>
                </div>
              </form>
              <Mensaje texto={mensaje} />
              <p className="text-center text-secondary mt-4 mb-0">
                ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
              </p>
              <div className="alert alert-light border mt-4 mb-0">
                <strong>Cuentas de prueba:</strong>
                <br />
                Administrador: admin@sonidovivo.cl / Admin123!
                <br />
                Vendedor: vendedor@sonidovivo.cl / Vendedor123!
                <br />
                Cliente: cliente@sonidovivo.cl / Cliente123!
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
