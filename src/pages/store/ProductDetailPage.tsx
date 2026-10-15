import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { obtenerImagenProducto } from "../../components/ProductoCard";
import { Mensaje } from "../../components/PageHelpers";
import { useStore } from "../../context/StoreContext";
import { formatearPrecio } from "../../utils/formatoPrecio";

export function Detalle() {
  const { id } = useParams();
  const { productos, agregarAlCarrito, usuarioActual } = useStore();
  const [mensaje, setMensaje] = useState("");
  const producto = productos.find((elemento) => elemento.id === id);

  if (!producto) {
    return (
      <main className="container py-5">
        <Link to="/catalogo" className="btn btn-outline-secondary mb-4">
          Volver al catálogo
        </Link>
        <div className="alert alert-warning">
          No se encontró el producto solicitado.
        </div>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <Link to="/catalogo" className="btn btn-outline-secondary mb-4">
            Volver al catálogo
          </Link>
          <section className="card shadow-sm border-0">
            <div className="card-body p-4 p-md-5">
              <div className="row g-4 align-items-center">
                <div className="col-md-6">
                  <img
                    className="detalle-img"
                    src={obtenerImagenProducto(producto.categoria)}
                    alt={producto.nombre}
                  />
                </div>
                <div className="col-md-6">
                  <span className="badge text-bg-secondary mb-3">
                    {producto.categoria}
                  </span>
                  <h1 className="h2 fw-bold">{producto.nombre}</h1>
                  <p className="text-secondary">
                    {producto.marca} · {producto.modelo}
                  </p>
                  <p className="text-secondary">{producto.descripcion}</p>
                  <p className="detail-label">Precio</p>
                  <p className="detail-value fs-4 text-primary fw-bold">
                    {formatearPrecio(producto.precio)}
                  </p>
                  <p className="detail-label">Disponibilidad</p>
                  <p className="detail-value">
                    Stock disponible: {producto.stock}
                  </p>
                  {usuarioActual?.rol === "cliente" ? (
                    <div className="d-grid mt-4">
                      <button
                        className="btn btn-primary btn-lg"
                        type="button"
                        disabled={producto.stock <= 0}
                        onClick={() =>
                          setMensaje(
                            agregarAlCarrito(producto.id)
                              ? "Producto agregado al carrito."
                              : "No hay stock suficiente.",
                          )
                        }
                      >
                        {producto.stock <= 0 ? "Sin stock" : "Agregar al carrito"}
                      </button>
                    </div>
                  ) : !usuarioActual ? (
                    <Link className="btn btn-primary btn-lg mt-4" to="/login">
                      Inicia sesión para comprar
                    </Link>
                  ) : (
                    <p className="text-secondary mt-4">
                      Las cuentas de personal no pueden comprar.
                    </p>
                  )}
                  <Mensaje texto={mensaje} tipo="success" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export function DetalleAntiguo() {
  const id = localStorage.getItem("productoSeleccionado");
  return id ? (
    <Navigate to={`/detalle/${encodeURIComponent(id)}`} replace />
  ) : (
    <Navigate to="/catalogo" replace />
  );
}
