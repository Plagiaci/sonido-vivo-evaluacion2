import { useState, type FormEvent } from "react";
import { Mensaje } from "../components/PageHelpers";
import { useStore } from "../context/StoreContext";

export function VendedorPage() {
  const { productos, actualizarStock } = useStore();
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );
  const guardarStock = (
    evento: FormEvent<HTMLFormElement>,
    idProducto: string,
  ) => {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    const stock = Number(formulario.get("stock"));
    const guardado = actualizarStock(idProducto, stock);
    setMensaje(
      guardado
        ? "Stock actualizado correctamente."
        : "No se pudo actualizar el stock. Ingresa un número entero igual o mayor a cero.",
    );
    setTipoMensaje(guardado ? "success" : "danger");
  };

  return (
    <main className="container py-5">
      <section className="mb-4">
        <span className="badge text-bg-primary mb-3">Vendedor</span>
        <h1 className="display-6 fw-bold">Gestión de la tienda</h1>
        <p className="text-secondary">
          Actualiza únicamente las existencias de los productos.
        </p>
      </section>
      <Mensaje texto={mensaje} tipo={tipoMensaje} />
      <section className="card shadow-sm border-0">
        <div className="card-body p-4">
          <h2 className="h4 fw-bold mb-3">Actualizar stock</h2>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock actual</th>
                  <th>Nuevo stock</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.stock}</td>
                    <td>
                      <form
                        id={`stock-${producto.id}`}
                        onSubmit={(evento) => guardarStock(evento, producto.id)}
                      >
                        <input
                          className="form-control"
                          name="stock"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={producto.stock}
                          required
                          aria-label={`Nuevo stock para ${producto.nombre}`}
                        />
                      </form>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary"
                        type="submit"
                        form={`stock-${producto.id}`}
                      >
                        Guardar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
