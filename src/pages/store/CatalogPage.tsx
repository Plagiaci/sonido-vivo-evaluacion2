import { useState } from "react";
import { ProductoCard } from "../../components/ProductoCard";
import { useStore } from "../../context/StoreContext";

export function Catalogo() {
  const { productos } = useStore();
  const [categoria, setCategoria] = useState("");
  const [precioMaximo, setPrecioMaximo] = useState("");
  const categorias = [...new Set(productos.map((producto) => producto.categoria))];
  const filtrados = productos.filter(
    (producto) =>
      (!categoria || producto.categoria === categoria) &&
      (!precioMaximo || producto.precio <= Number(precioMaximo)),
  );

  return (
    <main className="container py-5">
      <section className="mb-4">
        <span className="badge text-bg-primary mb-3">Catálogo</span>
        <h1 className="display-6 fw-bold">Nuestros productos</h1>
        <p className="text-secondary">
          Revisa nuestros instrumentos y equipos musicales.
        </p>
      </section>
      <section className="card shadow-sm border-0 mb-5">
        <div className="card-body p-4">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="filtroCategoria">
                Categoría
              </label>
              <select
                id="filtroCategoria"
                className="form-select"
                value={categoria}
                onChange={(evento) => setCategoria(evento.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categorias.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="filtroPrecio">
                Precio máximo
              </label>
              <input
                id="filtroPrecio"
                className="form-control"
                type="number"
                min="0"
                placeholder="Ejemplo: 400000"
                value={precioMaximo}
                onChange={(evento) => setPrecioMaximo(evento.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      {filtrados.length ? (
        <div className="row g-4">
          {filtrados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} />
          ))}
        </div>
      ) : (
        <div className="alert alert-light border text-center">
          No se encontraron productos.
        </div>
      )}
    </main>
  );
}
