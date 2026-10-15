const idProducto =
    localStorage.getItem("productoSeleccionado");


const producto =
    buscarProductoPorId(idProducto);


const ficha =
    document.getElementById("fichaProducto");


const mensajeNoEncontrado =
    document.getElementById("productoNoEncontrado");


const mensajeDetalle =
    document.getElementById("mensajeDetalle");


const botonAgregar =
    document.getElementById("btnAgregarCarrito");


const contadorCarrito =
    document.getElementById("contadorCarrito");



contadorCarrito.textContent =
    obtenerCantidadCarrito();



if (producto === undefined){

    mensajeNoEncontrado.classList.remove(
        "d-none"
    );

}else{

    mostrarProducto(producto);

}
function mostrarProducto(producto){


    ficha.classList.remove("d-none");


    document.getElementById(
        "imagenProducto"
    ).src = producto.imagen;


    document.getElementById(
        "imagenProducto"
    ).alt = producto.nombre;


    document.getElementById(
        "categoriaProducto"
    ).textContent = producto.categoria;


    document.getElementById(
        "nombreProducto"
    ).textContent = producto.nombre;


    document.getElementById(
        "descripcionProducto"
    ).textContent = producto.descripcion;


    document.getElementById(
        "precioProducto"
    ).textContent =
        "$" +
        producto.precio.toLocaleString("es-CL");


    document.getElementById(
        "stockProducto"
    ).textContent =
        "Stock disponible: " +
        producto.stock;



    if (producto.stock <= 0){

        botonAgregar.disabled = true;

        botonAgregar.textContent =
            "Sin stock";

    }

}
botonAgregar.addEventListener(
    "click",
    function (){


        if (producto === undefined){

            return;

        }


        const agregado =
            agregarAlCarrito(producto.id);



        if (agregado){

            mostrarExito(
                "Producto agregado al carrito."
            );


            contadorCarrito.textContent =
                obtenerCantidadCarrito();

        }else{

            mostrarError(
                "No hay stock suficiente."
            );

        }

    }
);
function mostrarError(mensaje){

    mensajeDetalle.textContent =
        mensaje;


    mensajeDetalle.classList.remove(
        "d-none"
    );


    mensajeDetalle.classList.remove(
        "alert-success"
    );


    mensajeDetalle.classList.add(
        "alert-danger"
    );

}



function mostrarExito(mensaje){

    mensajeDetalle.textContent =
        mensaje;


    mensajeDetalle.classList.remove(
        "d-none"
    );


    mensajeDetalle.classList.remove(
        "alert-danger"
    );


    mensajeDetalle.classList.add(
        "alert-success"
    );

}