const contenedor =
    document.getElementById("productosDestacados");

const productos = obtenerProductos();

const productosDestacados =
    productos.slice(0, 3);

    productosDestacados.forEach(function (producto){

    crearCardProducto(producto);

});

function crearCardProducto(producto){

    const columna = document.createElement("div");

    columna.className = "col-md-6 col-lg-4";


    const card = document.createElement("article");

    card.className =
        "card h-100 border-0 shadow-sm producto-card";


    const imagen = document.createElement("img");

    imagen.className = "card-img-top producto-img";

    imagen.src = producto.imagen;

    imagen.alt = producto.nombre;


    const cuerpo = document.createElement("div");

    cuerpo.className = "card-body p-4";


    const categoria = document.createElement("span");

    categoria.className =
        "badge text-bg-secondary mb-2";

    categoria.textContent = producto.categoria;


    const nombre = document.createElement("h3");

    nombre.className = "h5 fw-bold";

    nombre.textContent = producto.nombre;


    const precio = document.createElement("p");

    precio.className =
        "fs-5 fw-bold text-primary";

    precio.textContent =
        "$" + producto.precio.toLocaleString("es-CL");


    const stock = document.createElement("p");

    stock.className = "text-secondary";

    stock.textContent =
        "Stock disponible: " + producto.stock;


    cuerpo.appendChild(categoria);

    cuerpo.appendChild(nombre);

    cuerpo.appendChild(precio);

    cuerpo.appendChild(stock);


    card.appendChild(imagen);

    card.appendChild(cuerpo);


    columna.appendChild(card);


    contenedor.appendChild(columna);

}
