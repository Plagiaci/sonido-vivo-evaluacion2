const contenedor =
    document.getElementById("listaProductos");


const mensajeSinProductos =
    document.getElementById("sinProductos");


const filtroCategoria =
    document.getElementById("filtroCategoria");


const filtroPrecio =
    document.getElementById("filtroPrecio");


const mensajeCatalogo =
    document.getElementById("mensajeCatalogo");


const contadorCarrito =
    document.getElementById("contadorCarrito");

const productos = obtenerProductos();


mostrarProductos(productos);


actualizarContador();


function mostrarProductos(productos){

    contenedor.textContent = "";


    mensajeSinProductos.classList.add("d-none");


    if (productos.length === 0){

        mensajeSinProductos.classList.remove("d-none");

        return;

    }


    productos.forEach(function (producto){

        crearCardProducto(producto);

    });

}

function crearCardProducto(producto){


    const columna =
        document.createElement("div");


    columna.className =
        "col-md-6 col-lg-4";



    const card =
        document.createElement("article");


    card.className =
        "card producto-card h-100 border-0 shadow-sm";



    const imagen =
        document.createElement("img");


    imagen.className =
        "card-img-top producto-img";


    imagen.src =
        producto.imagen;


    imagen.alt =
        producto.nombre;



    const cuerpo =
        document.createElement("div");


    cuerpo.className =
        "card-body p-4 d-flex flex-column";



    const categoria =
        document.createElement("span");


    categoria.className =
        "badge text-bg-secondary mb-2 align-self-start";


    categoria.textContent =
        producto.categoria;



    const nombre =
        document.createElement("h2");


    nombre.className =
        "h5 fw-bold";


    nombre.textContent =
        producto.nombre;



    const precio =
        document.createElement("p");


    precio.className =
        "fs-5 fw-bold text-primary mb-1";


    precio.textContent =
        "$" +
        producto.precio.toLocaleString("es-CL");



    const stock =
        document.createElement("p");


    stock.className =
        "text-secondary";


    stock.textContent =
        "Stock disponible: " +
        producto.stock;
        const botonDetalle =
        document.createElement("button");


    botonDetalle.className =
        "btn btn-outline-secondary mt-auto mb-2";


    botonDetalle.textContent =
        "Ver detalle";


    botonDetalle.addEventListener(
        "click",
        function (){

            abrirDetalle(producto.id);

        }
    );
        const botonCarrito =
        document.createElement("button");


    botonCarrito.className =
        "btn btn-primary";


    botonCarrito.textContent =
        "Agregar al carrito";
        if (producto.stock <= 0){

        botonCarrito.disabled = true;

        botonCarrito.textContent =
            "Sin stock";

    }
        botonCarrito.addEventListener(
        "click",
        function (){


            const agregado =
                agregarAlCarrito(producto.id);


            if (agregado){

                mostrarExito(
                    "Producto agregado al carrito."
                );


                actualizarContador();


            }else{


                mostrarError(
                    "No hay stock suficiente."
                );

            }

        }
    );
        cuerpo.appendChild(categoria);

    cuerpo.appendChild(nombre);

    cuerpo.appendChild(precio);

    cuerpo.appendChild(stock);

    cuerpo.appendChild(botonDetalle);

    cuerpo.appendChild(botonCarrito);



    card.appendChild(imagen);

    card.appendChild(cuerpo);



    columna.appendChild(card);



    contenedor.appendChild(columna);

}

function abrirDetalle(id){

    localStorage.setItem(
        "productoSeleccionado",
        id
    );


    window.location.href =
        "detalle.html";

}

filtroCategoria.addEventListener(
    "change",
    function (){

        aplicarFiltros();

    }
);

filtroPrecio.addEventListener(
    "input",
    function (){

        aplicarFiltros();

    }
);
function aplicarFiltros(){


    const categoria =
        filtroCategoria.value;


    const precio =
        filtroPrecio.value;


    const productos =
        obtenerProductos();



    const productosFiltrados =
        productos.filter(function (producto){


            const cumpleCategoria =
                categoria === "" ||
                producto.categoria === categoria;



            const cumplePrecio =
                precio === "" ||
                producto.precio <= Number(precio);



            return cumpleCategoria &&
                   cumplePrecio;

        });



    mostrarProductos(
        productosFiltrados
    );

}

function mostrarError(mensaje){

    mensajeCatalogo.textContent =
        mensaje;


    mensajeCatalogo.classList.remove(
        "d-none"
    );


    mensajeCatalogo.classList.remove(
        "alert-success"
    );


    mensajeCatalogo.classList.add(
        "alert-danger"
    );

}
function mostrarExito(mensaje){

    mensajeCatalogo.textContent =
        mensaje;


    mensajeCatalogo.classList.remove(
        "d-none"
    );


    mensajeCatalogo.classList.remove(
        "alert-danger"
    );


    mensajeCatalogo.classList.add(
        "alert-success"
    );

}
function actualizarContador(){

    contadorCarrito.textContent =
        obtenerCantidadCarrito();

}