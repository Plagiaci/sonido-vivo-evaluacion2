import { useState, type FormEvent, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Mensaje } from "../components/PageHelpers";
import { useStore, type RolUsuario, type Usuario } from "../context/StoreContext";
import type { Producto } from "../types/Producto";
export function RutaCliente({ children }: { children: ReactNode }) {
  const { usuarioActual } = useStore();
  if (!usuarioActual) return <Navigate to="/login" replace />;
  if (usuarioActual.rol !== "cliente") return <Navigate to="/gestion" replace />;
  return <>{children}</>;
}

export function RutaPersonal({ children }: { children: ReactNode }) {
  const { usuarioActual } = useStore();
  if (!usuarioActual) return <Navigate to="/login" replace />;
  if (usuarioActual.rol === "cliente") return <Navigate to="/catalogo" replace />;
  return <>{children}</>;
}

export function Gestion() {
  const {
    productos,
    usuarios,
    usuarioActual,
    actualizarStock,
    actualizarProducto,
    guardarUsuarios,
  } = useStore();
  const [productoSeleccionado, setProductoSeleccionado] = useState(
    productos[0]?.id ?? "",
  );
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState<"danger" | "success">("success");
  const esAdministrador = usuarioActual?.rol === "administrador";
  const productoActual = productos.find(
    (producto) => producto.id === productoSeleccionado,
  );
  const notificar = (texto: string, tipo: "danger" | "success") => {
    setMensaje(texto);
    setTipoMensaje(tipo);
  };

  const guardarStock = (
    evento: FormEvent<HTMLFormElement>,
    idProducto: string,
  ) => {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    const stock = Number(formulario.get("stock"));
    const guardado = actualizarStock(idProducto, stock);
    notificar(
      guardado
        ? "Stock actualizado correctamente."
        : "No se pudo actualizar el stock. Ingresa un número entero igual o mayor a cero.",
      guardado ? "success" : "danger",
    );
  };

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
    notificar(
      guardado
        ? "Datos del producto actualizados correctamente."
        : "Revisa los campos: el stock debe ser un entero y el precio no puede ser negativo.",
      guardado ? "success" : "danger",
    );
  };

  const cambiarRol = (usuario: Usuario, rol: RolUsuario) => {
    if (
      usuario.rol === "administrador" &&
      rol !== "administrador" &&
      usuarios.filter((item) => item.rol === "administrador").length === 1
    ) {
      notificar("Debe existir al menos un administrador.", "danger");
      return;
    }
    guardarUsuarios(
      usuarios.map((item) => (item.id === usuario.id ? { ...item, rol } : item)),
    );
    notificar(
      `Rol actualizado para ${usuario.nombre} ${usuario.apellido}.`,
      "success",
    );
  };

  return (
    <main className="container py-5">
      <section className="mb-4">
        <span className="badge text-bg-primary mb-3">Personal</span>
        <h1 className="display-6 fw-bold">Gestión de la tienda</h1>
        <p className="text-secondary">
          {esAdministrador
            ? "Administra los datos de los productos y los roles de usuario."
            : "Actualiza únicamente las existencias de los productos."}
        </p>
      </section>
      <Mensaje texto={mensaje} tipo={tipoMensaje} />
      {esAdministrador ? (
        <>
          <section className="card shadow-sm border-0 mb-5">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold mb-3">Editar producto</h2>
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
                          type={name === "stock" || name === "precio" ? "number" : "text"}
                          min={name === "stock" || name === "precio" ? 0 : undefined}
                          step={name === "stock" ? 1 : name === "precio" ? 1 : undefined}
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
          <section className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h2 className="h4 fw-bold mb-3">Usuarios y roles</h2>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((usuario) => (
                      <tr key={usuario.id}>
                        <td>{usuario.nombre} {usuario.apellido}</td>
                        <td>{usuario.correo}</td>
                        <td>
                          <select
                            className="form-select"
                            aria-label={`Rol de ${usuario.nombre} ${usuario.apellido}`}
                            value={usuario.rol}
                            disabled={usuario.id === usuarioActual?.id}
                            onChange={(evento) => {
                              const rol = evento.target.value;
                              if (
                                rol === "cliente" ||
                                rol === "vendedor" ||
                                rol === "administrador"
                              ) {
                                cambiarRol(usuario, rol);
                              }
                            }}
                          >
                            <option value="cliente">Cliente</option>
                            <option value="vendedor">Vendedor</option>
                            <option value="administrador">Administrador</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      ) : (
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
      )}
    </main>
  );
}
