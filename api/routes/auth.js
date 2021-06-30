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


        console.log("Usuario " + usuario.nombre + " creado correctamente");

        // Devolucion de usuario registrado correctamente
        res.json({
            'status:': 'correcto'
        })

    } catch (err) {

        console.log("ERROR. No se ha añadido el usuario. Razon: " + err);

        // Devolucion de error 500 en el registro
        res.status(500).json({
            'status:': 'fail'
        })
    }

});


// Endpoint de Login
router.post('/login', async (req, res) => {
    try {

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

                // Eliminamos la contraseña de la variable usuario encontrado
                foundUser.set('password', undefined, {
                    strict: false
                });

                // Generacion de token a partir de los datos del login
                const token = jwt.sign({
                    userData: foundUser
                }, 'GardiFYHaSH2021', {
                    expiresIn: 120
                });


                // Devolucion de login correcto y token
                return res.json({
                    'status:': 'success',
                    'token': token
                });



            } else {
                // Contraseña incorrecta
                throw "Login incorrecto";
            }
        }
    } catch (err) {
        res.status(401).json({
            'status:': 'fail'
        });
    }

});




module.exports = router;