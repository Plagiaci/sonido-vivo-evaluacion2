import { useState, type FormEvent } from "react";
import { Mensaje } from "../components/PageHelpers";
import { useStore } from "../context/StoreContext";
import type { Producto } from "../types/Producto";

export function AdminProductsPage() {
  const { productos, actualizarProducto } = useStore();
  const [productoSeleccionado, setProductoSeleccionado] = useState(
    productos[0]?.id ?? "",
  );
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">(
    "success",
  );
  const productoActual = productos.find(
    (producto) => producto.id === productoSeleccionado,
  );

  const guardarDatosProducto = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!productoActual) return;
    const formulario = new FormData(evento.currentTarget);
    const leer = (campo: string) => String(formulario.get(campo) ?? "").trim();
    const actualizado: Producto = {
      ...productoActual,
      categoria: leer("categoria"),
      nombre: leer("nombre"),
      marca: leer("marca"),
      modelo: leer("modelo"),
      stock: Number(formulario.get("stock")),
      precio: Number(formulario.get("precio")),
      descripcion: leer("descripcion"),
    };
    const guardado = actualizarProducto(actualizado);
    setMensaje(
      guardado
        ? "Datos del producto actualizados correctamente."
        : "Revisa los campos: el stock debe ser un entero y el precio no puede ser negativo.",
    );
    setTipoMensaje(guardado ? "success" : "danger");
  };

  return (
    <section className="card shadow-sm border-0 mb-5">
      <div className="card-body p-4">
        <h2 className="h4 fw-bold mb-3">Administración de productos</h2>
        <Mensaje texto={mensaje} tipo={tipoMensaje} />
        <label className="form-label" htmlFor="productoSeleccionado">
          Producto
        </label>
        <select
          className="form-select mb-4"
          id="productoSeleccionado"
          value={productoSeleccionado}
          onChange={(evento) => setProductoSeleccionado(evento.target.value)}
        >
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.id} · {producto.nombre}
            </option>
          ))}
        </select>
        {productoActual && (
          <form key={productoActual.id} onSubmit={guardarDatosProducto}>
            <div className="row g-3">
              {(
                [
                  ["categoria", "Categoría", productoActual.categoria],
                  ["nombre", "Nombre", productoActual.nombre],
                  ["marca", "Marca", productoActual.marca],
                  ["modelo", "Modelo", productoActual.modelo],
                  ["stock", "Stock", productoActual.stock],
                  ["precio", "Precio", productoActual.precio],
                ] as const
              ).map(([name, label, value]) => (
                <div className="col-md-6" key={name}>
                  <label className="form-label" htmlFor={`producto-${name}`}>
                    {label}
                  </label>
                  <input
                    className="form-control"
                    id={`producto-${name}`}
                    name={name}
                    type={
                      name === "stock" || name === "precio" ? "number" : "text"
                    }
                    min={
                      name === "stock" || name === "precio" ? 0 : undefined
                    }
                    step={
                      name === "stock" || name === "precio" ? 1 : undefined
                    }
                    defaultValue={value}
                    required
                  />
                </div>
              ))}
              <div className="col-12">
                <label className="form-label" htmlFor="producto-descripcion">
                  Descripción
                </label>
                <textarea
                  className="form-control"
                  id="producto-descripcion"
                  name="descripcion"
                  rows={3}
                  defaultValue={productoActual.descripcion}
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary mt-4" type="submit">
              Guardar cambios
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
