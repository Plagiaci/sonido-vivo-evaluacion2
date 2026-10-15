const CLAVE_PRODUCTOS = "sonidovivo_productos";
const CLAVE_USUARIOS = "sonidovivo_usuarios";


function obtenerProductos(){

    const datos = localStorage.getItem(CLAVE_PRODUCTOS);

    if (datos === null) return [];

    return JSON.parse(datos);

}


function guardarProductos(productos){

    const productosJSON = JSON.stringify(productos);

    localStorage.setItem(CLAVE_PRODUCTOS, productosJSON);

}


function buscarProductoPorId(id){

    const productos = obtenerProductos();

    return productos.find(function (producto){

        return producto.id === id;

    });

}

function cargarProductosIniciales(){

    const productos = obtenerProductos();


    if (productos.length > 0){

        return;

    }


    const productosIniciales = [

        {
            id: crypto.randomUUID(),
            nombre: "Guitarra Eléctrica Fender",
            categoria: "Guitarras",
            precio: 699990,
            stock: 8,
            imagen: "img/guitarra-electrica.jpg",
            descripcion: "Guitarra eléctrica ideal para rock, blues y pop."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Guitarra Acústica Yamaha",
            categoria: "Guitarras",
            precio: 249990,
            stock: 12,
            imagen: "img/guitarra-acustica.jpg",
            descripcion: "Guitarra acústica con excelente sonido."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Bajo Eléctrico Ibanez",
            categoria: "Bajos",
            precio: 399990,
            stock: 5,
            imagen: "img/bajo.jpg",
            descripcion: "Bajo eléctrico de cuatro cuerdas."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Batería Pearl",
            categoria: "Baterías",
            precio: 849990,
            stock: 3,
            imagen: "img/bateria.jpg",
            descripcion: "Batería acústica completa Pearl."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Teclado Yamaha",
            categoria: "Teclados",
            precio: 329990,
            stock: 10,
            imagen: "img/teclado.jpg",
            descripcion: "Teclado digital Yamaha."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Amplificador Marshall",
            categoria: "Amplificadores",
            precio: 449990,
            stock: 6,
            imagen: "img/amplificador.jpg",
            descripcion: "Amplificador para guitarra eléctrica."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Micrófono Shure SM58",
            categoria: "Micrófonos",
            precio: 119990,
            stock: 20,
            imagen: "img/microfono.jpg",
            descripcion: "Micrófono profesional para voces."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Pedal Boss Distortion",
            categoria: "Pedales",
            precio: 99990,
            stock: 15,
            imagen: "img/pedal.jpg",
            descripcion: "Pedal de distorsión para guitarra."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Audífonos Audio-Technica",
            categoria: "Accesorios",
            precio: 89990,
            stock: 18,
            imagen: "img/audifonos.jpg",
            descripcion: "Audífonos para estudio y producción."
        },

        {
            id: crypto.randomUUID(),
            nombre: "Soporte para Guitarra",
            categoria: "Accesorios",
            precio: 24990,
            stock: 30,
            imagen: "img/soporte.jpg",
            descripcion: "Soporte resistente para guitarras."
        }

    ];


    guardarProductos(productosIniciales);

}


cargarProductosIniciales();


const CLAVE_CARRITO = "sonidovivo_carrito";


function obtenerCarrito(){

    const datos = localStorage.getItem(CLAVE_CARRITO);

    if (datos === null) return [];

    return JSON.parse(datos);

}


function guardarCarrito(carrito){

    const carritoJSON = JSON.stringify(carrito);

    localStorage.setItem(CLAVE_CARRITO, carritoJSON);

}

function agregarAlCarrito(idProducto){

    const producto = buscarProductoPorId(idProducto);


    if (producto === undefined){

        return false;

    }


    if (producto.stock <= 0){

        return false;

    }


    const carrito = obtenerCarrito();


    const productoCarrito =
        carrito.find(function (item){

            return item.idProducto === idProducto;

        });


    if (productoCarrito === undefined){


        const nuevoItem = {

            idProducto: producto.id,

            nombre: producto.nombre,

            precio: producto.precio,

            imagen: producto.imagen,

            cantidad: 1

        };


        carrito.push(nuevoItem);


    }else{


        if (productoCarrito.cantidad >= producto.stock){

            return false;

        }


        productoCarrito.cantidad =
            productoCarrito.cantidad + 1;

    }


    guardarCarrito(carrito);


    return true;

}

function obtenerCantidadCarrito(){

    const carrito = obtenerCarrito();


    let cantidad = 0;


    carrito.forEach(function (item){

        cantidad = cantidad + item.cantidad;

    });


    return cantidad;

}
function obtenerUsuarios(){

    const datos =
        localStorage.getItem(CLAVE_USUARIOS);


    if (datos === null) return [];


    return JSON.parse(datos);

}



function guardarUsuarios(usuarios){

    const usuariosJSON =
        JSON.stringify(usuarios);


    localStorage.setItem(
        CLAVE_USUARIOS,
        usuariosJSON
    );

}



function agregarUsuario(usuario){

    const usuarios =
        obtenerUsuarios();


    usuarios.push(usuario);


    guardarUsuarios(usuarios);

}



function buscarUsuarioPorCorreo(correo){

    const usuarios =
        obtenerUsuarios();


    return usuarios.find(function (usuario){

        return usuario.correo === correo;

    });

}
function eliminarDelCarrito(idProducto){

    const carrito =
        obtenerCarrito();


    const nuevoCarrito =
        carrito.filter(function (item){

            return item.idProducto !== idProducto;

        });


    guardarCarrito(nuevoCarrito);

}