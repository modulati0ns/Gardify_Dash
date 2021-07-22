const express = require('express');
const router = express.Router();

// Librerias
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Importar modelo de usuarios
import userModel from '../modelos/userModel.js'


// Endpoint de Registro
router.post('/register', async (req, res) => {
    try {

        console.log("[INFO]".magenta + "[Auth] ".blue + "Registrando el usuario")

        // Recogemos los datos de POST
        const userToRegister = req.body;

        // Encriptamos la contraseña recibida
        const encryptedPassword = bcrypt.hashSync(userToRegister.password, 15);

        // Insertar usuario en la base de datos
        const usuario = await userModel.create({
            nombre: userToRegister.nombre,
            apellidos: userToRegister.apellidos,
            email: userToRegister.email,
            password: encryptedPassword
        });


        console.log("[OK]".green + "[Auth] ".blue + "Usuario " + usuario.nombre + " creado correctamente");

        // Devolucion de usuario registrado correctamente
        res.json({
            'status': 'success',
            'description': 'Usuario registrado correctamente',
            'userId': usuario._id
        })

    } catch (err) {

        console.log("[FAIL]".red + "[Auth] ".blue + "ERROR. No se ha añadido el usuario: " + err);

        // Devolucion de error 500 en el registro y el error para detectar si el email es unico
        res.status(500).json({
            'status:': 'fail',
            'error': err
        })
    }

});


// Endpoint de Login
router.post('/login', async (req, res) => {
    try {
        console.log("[INFO]".magenta + "[Auth] ".blue + "Iniciando sesión")

        // Recogemos los datos de POST
        const userToLogin = req.body;

        // Busqueda de usuario en la base de datos por email
        var foundUser = await userModel.findOne({
            email: userToLogin.email
        });

        // Si no se encuentra el usuario en la base de datos
        if (!foundUser) {
            throw "Login incorrecto";

            // Si se encuentra el usuario
        } else {

            // Comprobación de contraseña
            if (bcrypt.compareSync(userToLogin.password, foundUser.password)) {
                // Contraseña correcta

                // Eliminamos la contraseña de la variable usuario encontrado para que no aaprezca en el token
                foundUser.set('password', undefined, {
                    strict: false
                });

                // Generacion de token a partir de los datos del login
                const token = jwt.sign({
                    userData: foundUser
                }, 'GardiFYHaSH2021', {
                    expiresIn: 3600 * 24
                });

                // Si el token es correcto se inicia la sesión
                if (token) {
                    console.log("[OK]".green + "[Auth] ".blue + "Sesión iniciada correctamente");
                    // Devolucion de login correcto y token
                    return res.json({
                        'status': 'success',
                        'description': 'Sesion iniciada correctamente',
                        'token': token,
                        'userData': foundUser
                    });
                }



            } else {
                // Contraseña incorrecta
                throw "Login incorrecto";
            }
        }
    } catch (err) {
        console.log("[FAIL]".red + "[Auth] ".blue + "Hubo un fallo en el inicio se sesion; " + err);
        res.status(401).json({
            'status': 'fail',
            'description': 'Hubo un fallo en el inicio de sesion',
            'error': err
        });
    }

});




module.exports = router;