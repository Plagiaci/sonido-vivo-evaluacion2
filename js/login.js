const formulario =
    document.getElementById("formLogin");


const mensajeLogin =
    document.getElementById("mensajeLogin");


const contadorCarrito =
    document.getElementById("contadorCarrito");


contadorCarrito.textContent =
    obtenerCantidadCarrito();



formulario.addEventListener(
    "submit",
    function (evento){


        evento.preventDefault();



        const correo =
            document.getElementById(
                "correo"
            ).value.trim().toLowerCase();


        const password =
            document.getElementById(
                "password"
            ).value;



        // VALIDAR CORREO

        if (correo === ""){

            mostrarError(
                "Debe ingresar su correo."
            );

            return;

        }



        // VALIDAR PASSWORD

        if (password === ""){

            mostrarError(
                "Debe ingresar su contraseña."
            );

            return;

        }



        // BUSCAR USUARIO

        const usuarios =
            obtenerUsuarios();


        const usuario =
            usuarios.find(function (usuario){

                return usuario.correo === correo;

            });



        // SI NO EXISTE

        if (usuario === undefined){

            mostrarError(
                "Correo o contraseña incorrectos."
            );

            return;

        }



        // SI ESTA BLOQUEADO

        if (usuario.bloqueado === true){

            mostrarError(
                "La cuenta se encuentra bloqueada."
            );

            return;

        }



        // PASSWORD INCORRECTA

        if (usuario.password !== password){


            usuario.intentosFallidos =
                usuario.intentosFallidos + 1;



            if (usuario.intentosFallidos >= 3){


                usuario.bloqueado = true;


                guardarUsuarios(usuarios);


                mostrarError(
                    "Cuenta bloqueada por alcanzar 3 intentos fallidos."
                );


                return;

            }



            guardarUsuarios(usuarios);



            const intentosRestantes =
                3 - usuario.intentosFallidos;



            mostrarError(
                "Correo o contraseña incorrectos. Intentos restantes: "
                + intentosRestantes
            );


            return;

        }



        // LOGIN CORRECTO

        usuario.intentosFallidos = 0;


        guardarUsuarios(usuarios);



        mostrarExito(
            "Inicio de sesión correcto. Bienvenido "
            + usuario.nombre
            + "."
        );



        formulario.reset();

    }
);