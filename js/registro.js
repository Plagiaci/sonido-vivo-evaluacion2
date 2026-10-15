const formulario =
    document.getElementById("formRegistro");


const mensajeRegistro =
    document.getElementById("mensajeRegistro");


const contadorCarrito =
    document.getElementById("contadorCarrito");


contadorCarrito.textContent =
    obtenerCantidadCarrito();



formulario.addEventListener(
    "submit",
    function (evento){


        evento.preventDefault();



        const nombre =
            document.getElementById("nombre").value;


        const apellido =
            document.getElementById("apellido").value;


        const fechaNacimiento =
            document.getElementById(
                "fechaNacimiento"
            ).value;


        const correo =
            document.getElementById(
                "correo"
            ).value.trim().toLowerCase();


        const password =
            document.getElementById(
                "password"
            ).value;


        const confirmarPassword =
            document.getElementById(
                "confirmarPassword"
            ).value;


        const direccion =
            document.getElementById(
                "direccion"
            ).value;


        const region =
            document.getElementById(
                "region"
            ).value;


        const genero =
            document.getElementById(
                "genero"
            ).value;


        const condiciones =
            document.getElementById(
                "condiciones"
            ).checked;



        // NOMBRE

        if (nombre.trim() === ""){

            mostrarError(
                "El nombre es obligatorio."
            );

            return;

        }



        // APELLIDO

        if (apellido.trim() === ""){

            mostrarError(
                "El apellido es obligatorio."
            );

            return;

        }



        // FECHA NACIMIENTO

        if (fechaNacimiento === ""){

            mostrarError(
                "Debe ingresar la fecha de nacimiento."
            );

            return;

        }



        const fechaIngresada =
            new Date(fechaNacimiento);


        const fechaActual =
            new Date();



        if (fechaIngresada > fechaActual){

            mostrarError(
                "La fecha no puede ser posterior a hoy."
            );

            return;

        }



        // EDAD

        const edad =
            calcularEdad(fechaNacimiento);



        if (edad < 14){

            mostrarError(
                "Debe tener al menos 14 años."
            );

            return;

        }



        // CORREO

        if (correo === ""){

            mostrarError(
                "El correo es obligatorio."
            );

            return;

        }



        if (!correo.endsWith("@duoc.cl")){

            mostrarError(
                "El correo debe pertenecer al dominio duoc.cl."
            );

            return;

        }



        // CORREO DUPLICADO

        const usuarioExistente =
            buscarUsuarioPorCorreo(correo);



        if (usuarioExistente !== undefined){

            mostrarError(
                "Ya existe una cuenta con ese correo."
            );

            return;

        }



        // PASSWORD

        if (password === ""){

            mostrarError(
                "La contraseña es obligatoria."
            );

            return;

        }



        if (password.length < 8){

            mostrarError(
                "La contraseña debe tener mínimo 8 caracteres."
            );

            return;

        }



        if (password !== confirmarPassword){

            mostrarError(
                "Las contraseñas no coinciden."
            );

            return;

        }



        // DIRECCION

        if (direccion.trim() === ""){

            mostrarError(
                "La dirección es obligatoria."
            );

            return;

        }



        // REGION

        if (region === ""){

            mostrarError(
                "Debe seleccionar una región."
            );

            return;

        }



        // GENERO

        if (genero === ""){

            mostrarError(
                "Debe seleccionar una opción de género."
            );

            return;

        }



        // TERMINOS

        if (condiciones === false){

            mostrarError(
                "Debe aceptar las condiciones."
            );

            return;

        }



        // CREAR USUARIO

        const nuevoUsuario = {

            id: crypto.randomUUID(),

            nombre: nombre,

            apellido: apellido,

            fechaNacimiento: fechaNacimiento,

            correo: correo,

            password: password,

            direccion: direccion,

            region: region,

            genero: genero,

            intentosFallidos: 0,

            bloqueado: false

        };



        agregarUsuario(nuevoUsuario);



        mostrarExito(
            "Usuario registrado correctamente."
        );



        formulario.reset();

    }
);

function mostrarError(mensaje){

    mensajeRegistro.textContent =
        mensaje;


    mensajeRegistro.classList.remove(
        "d-none"
    );


    mensajeRegistro.classList.remove(
        "alert-success"
    );


    mensajeRegistro.classList.add(
        "alert-danger"
    );

}



function mostrarExito(mensaje){

    mensajeRegistro.textContent =
        mensaje;


    mensajeRegistro.classList.remove(
        "d-none"
    );


    mensajeRegistro.classList.remove(
        "alert-danger"
    );


    mensajeRegistro.classList.add(
        "alert-success"
    );

}
function calcularEdad(fechaNacimiento){

    const nacimiento = new Date(fechaNacimiento);

    const hoy = new Date();

    let edad =
        hoy.getFullYear() -
        nacimiento.getFullYear();

    const mes =
        hoy.getMonth() -
        nacimiento.getMonth();


    if (
        mes < 0 ||
        (
            mes === 0 &&
            hoy.getDate() < nacimiento.getDate()
        )
    ){

        edad = edad - 1;

    }


    return edad;

}