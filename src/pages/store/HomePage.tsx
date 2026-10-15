import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ProductoCard } from "../../components/ProductoCard";
import { Mensaje } from "../../components/PageHelpers";
import { useStore } from "../../context/StoreContext";

export function Inicio() {
  const { productos } = useStore();
  const [consultaEnviada, setConsultaEnviada] = useState(false);

  const enviarConsulta = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setConsultaEnviada(true);
    evento.currentTarget.reset();
  };

  return (
    <>
      <header className="hero">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span className="badge text-bg-warning mb-3">
                Instrumentos y equipos musicales
              </span>
              <h1 className="display-4 fw-bold text-white">
                Vive la música con Sonido Vivo
              </h1>
              <p className="lead text-white">
                Encuentra instrumentos, amplificadores, micrófonos y accesorios
                para llevar tu música al siguiente nivel.
              </p>
              <Link to="/catalogo" className="btn btn-warning btn-lg">
                Ver productos
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main>
        <section className="container py-5">
          <div className="text-center mb-5">
            <span className="badge text-bg-dark mb-3">Catálogo</span>
            <h2 className="fw-bold">Productos destacados</h2>
            <p className="text-secondary">
              Algunos de nuestros instrumentos y equipos destacados.
            </p>
          </div>
          <div className="row g-4">
            {productos.slice(0, 3).map((producto) => (
              <ProductoCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
        <section id="nosotros" className="bg-light py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <span className="badge text-bg-secondary mb-3">Sonido Vivo</span>
                <h2 className="fw-bold">Quiénes somos</h2>
                <p className="text-secondary">
                  Sonido Vivo es una tienda dedicada a la venta de instrumentos
                  musicales, equipos de sonido y accesorios.
                </p>
                <p className="text-secondary">
                  Nuestro objetivo es ofrecer a músicos y amantes de la música
                  una forma sencilla de encontrar los productos que necesitan.
                </p>
                <h5 className="mt-4">Nuestro equipo</h5>
              </div>
            </div>
          </div>
        </section>
        <section id="contacto" className="container py-5">
          <div className="text-center mb-5">
            <span className="badge text-bg-primary mb-3">Contacto</span>
            <h2 className="fw-bold">Contáctanos</h2>
          </div>
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">Nuestra ubicación</h5>
                  <iframe
                    title="Ubicación de Sonido Vivo en Viña del Mar"
                    src="https://www.google.com/maps?q=Vi%C3%B1a+del+Mar,Chile&output=embed"
                    width="100%"
                    height="350"
                    style={{ border: 0 }}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-4">Envíanos una consulta</h5>
                  <form onSubmit={enviarConsulta}>
                    <label className="form-label" htmlFor="nombreContacto">
                      Nombre
                    </label>
                    <input
                      className="form-control mb-3"
                      id="nombreContacto"
                      required
                    />
                    <label className="form-label" htmlFor="correoContacto">
                      Correo
                    </label>
                    <input
                      className="form-control mb-3"
                      id="correoContacto"
                      type="email"
                      required
                    />
                    <label className="form-label" htmlFor="mensajeContacto">
                      Mensaje
                    </label>
                    <textarea
                      className="form-control mb-3"
                      id="mensajeContacto"
                      rows={5}
                      required
                    />
                    <div className="d-grid">
                      <button className="btn btn-primary" type="submit">
                        Enviar consulta
                      </button>
                    </div>
                  </form>
                  {consultaEnviada && (
                    <Mensaje
                      texto="Consulta enviada correctamente."
                      tipo="success"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
