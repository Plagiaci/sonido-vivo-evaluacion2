import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mensaje } from "../../components/PageHelpers";
import { useStore } from "../../context/StoreContext";
import { formatearPrecio } from "../../utils/formatoPrecio";

export function Carrito() {
  const { carrito, eliminarDelCarrito, vaciarCarrito, finalizarCompra } =
    useStore();
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );
  const navigate = useNavigate();
  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0,
  );

  const comprar = () => {
    const error = finalizarCompra();
    if (error) {
      setMensaje(error);
      setTipoMensaje("danger");
      return;
    }
    setMensaje("Compra realizada exitosamente. El stock fue actualizado.");
    setTipoMensaje("success");
  };

  return (
    <main className="container py-5">
      <section className="mb-4">
        <span className="badge text-bg-primary mb-3">Compra</span>
        <h1 className="display-6 fw-bold">Carrito de compras</h1>
        <p className="text-secondary">
          Revisa los productos antes de finalizar tu compra.
        </p>
      </section>
      {!carrito.length ? (
        <div className="alert alert-light border text-center">
          El carrito está vacío.
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item) => (
                  <tr key={item.idProducto}>
                    <td className="fw-semibold">{item.nombre}</td>
                    <td>{item.cantidad}</td>
                    <td>{formatearPrecio(item.precio)}</td>
                    <td className="fw-bold">
                      {formatearPrecio(item.precio * item.cantidad)}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        type="button"
                        onClick={() => eliminarDelCarrito(item.idProducto)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row justify-content-end">
            <div className="col-md-5 col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <p className="text-secondary mb-1">Total de la compra</p>
                  <p className="display-6 fw-bold text-primary">
                    {formatearPrecio(total)}
                  </p>
                  <div className="d-grid gap-2">
                    <button
                      className="btn btn-success btn-lg"
                      type="button"
                      onClick={comprar}
                    >
                      Finalizar compra
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={() => {
                        vaciarCarrito();
                        setMensaje("El carrito fue vaciado.");
                        setTipoMensaje("success");
                      }}
                    >
                      Vaciar carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <Mensaje
        texto={mensaje}
        tipo={tipoMensaje}
      />
    </main>
  );
}
