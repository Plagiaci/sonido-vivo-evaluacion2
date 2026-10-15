const listaCarrito =
    document.getElementById("listaCarrito");


const carritoVacio =
    document.getElementById("carritoVacio");


const contenedorCarrito =
    document.getElementById("contenedorCarrito");


const totalCarrito =
    document.getElementById("totalCarrito");


const btnVaciarCarrito =
    document.getElementById("btnVaciarCarrito");


const btnFinalizarCompra =
    document.getElementById("btnFinalizarCompra");


const mensajeCarrito =
    document.getElementById("mensajeCarrito");


const contadorCarrito =
    document.getElementById("contadorCarrito");



mostrarCarrito();
function mostrarCarrito(){

    const carrito =
        obtenerCarrito();


    listaCarrito.textContent = "";


    contadorCarrito.textContent =
        obtenerCantidadCarrito();



    if (carrito.length === 0){

        carritoVacio.classList.remove(
            "d-none"
        );


        contenedorCarrito.classList.add(
            "d-none"
        );


        return;

    }



    carritoVacio.classList.add(
        "d-none"
    );


    contenedorCarrito.classList.remove(
        "d-none"
    );



    let total = 0;



    carrito.forEach(function (item){

        crearFilaCarrito(item);


        total =
            total +
            (item.precio * item.cantidad);

    });



    totalCarrito.textContent =
        "$" +
        total.toLocaleString("es-CL");

}
function crearFilaCarrito(item){


    const fila =
        document.createElement("tr");



    // PRODUCTO

    const celdaProducto =
        document.createElement("td");


    const nombre =
        document.createElement("span");


    nombre.textContent =
        item.nombre;


    nombre.className =
        "fw-semibold";


    celdaProducto.appendChild(nombre);



    // CANTIDAD

    const celdaCantidad =
        document.createElement("td");


    celdaCantidad.textContent =
        item.cantidad;



    // PRECIO

    const celdaPrecio =
        document.createElement("td");


    celdaPrecio.textContent =
        "$" +
        item.precio.toLocaleString("es-CL");



    // SUBTOTAL

    const subtotal =
        item.precio *
        item.cantidad;


    const celdaSubtotal =
        document.createElement("td");


    celdaSubtotal.className =
        "fw-bold";


    celdaSubtotal.textContent =
        "$" +
        subtotal.toLocaleString("es-CL");



    // BOTON ELIMINAR

    const celdaAccion =
        document.createElement("td");


    const botonEliminar =
        document.createElement("button");


    botonEliminar.className =
        "btn btn-outline-danger btn-sm";


    botonEliminar.textContent =
        "Eliminar";
            celdaAccion.appendChild(
        botonEliminar
    );


    fila.appendChild(
        celdaProducto
    );


    fila.appendChild(
        celdaCantidad
    );


    fila.appendChild(
        celdaPrecio
    );


    fila.appendChild(
        celdaSubtotal
    );


    fila.appendChild(
        celdaAccion
    );


    listaCarrito.appendChild(
        fila
    );

}
btnVaciarCarrito.addEventListener(
    "click",
    function (){


        vaciarCarrito();


        mostrarCarrito();


        mostrarExito(
            "El carrito fue vaciado."
        );

    }
);
btnFinalizarCompra.addEventListener(
    "click",
    function (){


        const carrito =
            obtenerCarrito();


        if (carrito.length === 0){

            mostrarError(
                "No existen productos para comprar."
            );

            return;

        }


        const productos =
            obtenerProductos();
                    for (
            let i = 0;
            i < carrito.length;
            i++
        ){

            const item =
                carrito[i];


            const producto =
                productos.find(
                    function (producto){

                        return producto.id ===
                               item.idProducto;

                    }
                );



            if (producto === undefined){

                mostrarError(
                    "Uno de los productos ya no existe."
                );

                return;

            }



            if (
                item.cantidad >
                producto.stock
            ){

                mostrarError(
                    "No existe stock suficiente para "
                    + producto.nombre
                    + "."
                );

                return;

            }

        }
                carrito.forEach(
            function (item){


                const producto =
                    productos.find(
                        function (producto){

                            return producto.id ===
                                   item.idProducto;

                        }
                    );


                producto.stock =
                    producto.stock -
                    item.cantidad;

            }
        );
                guardarProductos(
            productos
        );
                vaciarCarrito();
                mostrarCarrito();
                        mostrarExito(
            "Compra realizada exitosamente. El stock fue actualizado."
        );
                setTimeout(
            function (){

                window.location.href =
                    "index.html";

            },
            1800
        );

    }
);
function mostrarError(mensaje){

    mensajeCarrito.textContent =
        mensaje;


    mensajeCarrito.classList.remove(
        "d-none"
    );


    mensajeCarrito.classList.remove(
        "alert-success"
    );


    mensajeCarrito.classList.add(
        "alert-danger"
    );

}
function mostrarExito(mensaje){

    mensajeCarrito.textContent =
        mensaje;


    mensajeCarrito.classList.remove(
        "d-none"
    );


    mensajeCarrito.classList.remove(
        "alert-danger"
    );


    mensajeCarrito.classList.add(
        "alert-success"
    );

}