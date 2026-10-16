import { useState, type FormEvent } from "react";
import { Mensaje } from "../components/PageHelpers";
import { useStore } from "../context/StoreContext";
import { formatearPrecio } from "../utils/formatoPrecio";

export function VendedorPage() {
  const { productos, actualizarStock } = useStore();
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );
  const terminoBusqueda = busqueda.trim().toLocaleLowerCase("es-CL");
  const productosFiltrados = productos.filter((producto) =>
    [
      producto.id,
      producto.nombre,
      producto.categoria,
      producto.marca,
      producto.modelo,
      producto.descripcion,
    ].some((dato) => dato.toLocaleLowerCase("es-CL").includes(terminoBusqueda)),
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
          <h2 className="h4 fw-bold mb-3">Productos y existencias</h2>
          <label className="form-label" htmlFor="buscar-productos-vendedor">
            Buscar producto
          </label>
          <input
            className="form-control mb-3"
            id="buscar-productos-vendedor"
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Busca por nombre, código, categoría, marca o modelo"
          />
          <p className="small text-secondary" aria-live="polite">
            {productosFiltrados.length} de {productos.length} productos
          </p>
          <div className="list-group">
            {productosFiltrados.map((producto) => (
              <details className="list-group-item" key={producto.id}>
                <summary className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                  <span>
                    <span className="fw-semibold">{producto.nombre}</span>
                    <span className="d-block small text-secondary">
                      {producto.id} · {producto.categoria}
                    </span>
                  </span>
                  <span className="badge text-bg-light">
                    Stock: {producto.stock}
                  </span>
                </summary>
                <div className="border-top mt-3 pt-3">
                  <div className="small mb-3">
                    <p className="mb-1">
                      <strong>Marca:</strong> {producto.marca}
                    </p>
                    <p className="mb-1">
                      <strong>Modelo:</strong> {producto.modelo}
                    </p>
                    <p className="mb-1">
                      <strong>Precio:</strong>{" "}
                      {formatearPrecio(producto.precio)}
                    </p>
                    <p className="mb-0">
                      <strong>Descripción:</strong> {producto.descripcion}
                    </p>
                  </div>
                  <form
                    id={`stock-${producto.id}`}
                    className="row g-2 align-items-end"
                    onSubmit={(evento) => guardarStock(evento, producto.id)}
                  >
                    <div className="col-sm-6 col-md-4">
                      <label
                        className="form-label mb-1"
                        htmlFor={`nuevo-stock-${producto.id}`}
                      >
                        Nuevo stock
                      </label>
                      <input
                        className="form-control"
                        id={`nuevo-stock-${producto.id}`}
                        name="stock"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={producto.stock}
                        required
                      />
                    </div>
                    <div className="col-auto">
                      <button
                        className="btn btn-outline-primary"
                        type="submit"
                      >
                        Guardar stock
                      </button>
                    </div>
                  </form>
                </div>
              </details>
            ))}
            {productosFiltrados.length === 0 && (
              <p className="text-center text-secondary py-4 mb-0">
                No se encontraron productos que coincidan con la búsqueda.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
