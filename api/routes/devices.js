// Librerias
const express = require('express');
const router = express.Router();

const {
    comprobacionToken
} = require('../middleware/tokenAuth.js');

// Importar modelo de usuarios
import deviceModel from '../modelos/deviceModel.js'

// CRUD de dispositivos

// Leer informacion de uno o varios dispositivos
router.get("/devices", comprobacionToken, (req, res) => {
    try {

        // Ahora que hemos confirmado que la request tiene un token valido, listamos los usuarios de este usuario
        const userID = req.userData._id;

        res.json({
            status: 'success'
        })

    } catch (error) {
        res.json({
            status: 'fail',
            error: error
        })
    }
});

// Crear nuevo dispositivo
router.post("/devices", comprobacionToken, async (req, res) => {

    try {

        // Recogemos los datos enviados por post
        var nuevoDispositivo = req.body.nuevoDispositivo;

        // Seleccionamos el id del usuario que esta logeado y que ha entrado en la request gracias a comprobacion Token
        var userId = req.userData._id;

        // metemos el userId en los datos a agregar en la coleccion de dispositivos
        nuevoDispositivo.userId = userId;

        // metemos el tiempo actual (createdTime) en los datos a agregar
        nuevoDispositivo.createdTime = Date.now();

        // Crear el nuevo dispositivo en la base de datos
        await deviceModel.create(nuevoDispositivo);

        res.json({
            status: 'success'
        });

    } catch (err) {

        res.json({
            status: 'fail',
            error: err
        });

    }
});

// Eliminar un dispositivo
router.delete("/devices", (req, res) => {

});

// Actualizar informacion de uno o varios dispositivos
router.put("/devices", (req, res) => {

});

module.exports = router;