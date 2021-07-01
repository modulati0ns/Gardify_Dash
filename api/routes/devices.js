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
router.get("/devices", comprobacionToken, async (req, res) => {
    try {

        // Ahora que hemos confirmado que la request tiene un token valido, listamos los usuarios de este usuario
        const userId = req.userData._id;

        // Obtener los dispositivos del usuario
        const devices = await deviceModel.find({
            userId: userId
        });

        // Devolvemos los dispositivos encontrados
        if (devices != "undefined") {
            res.json({
                'status': 'success',
                'description': 'Se han encontrado los siguientes dispositivos',
                'devices': devices
            })
        } else {
            res.json({
                'status': 'fail',
                'error': "No se han encontrado dispositivos"
            })
        }
    } catch (error) {
        res.json({
            'status': 'fail',
            'error': error
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
            'status': 'success',
            'description': 'Dispositivo añadido correctamente',
        });

    } catch (err) {

        res.json({
            'status': 'fail',
            'error': err
        });

    }
});

// Eliminar un dispositivo
router.delete("/devices", comprobacionToken, async (req, res) => {
    try {
        // Ahora que hemos confirmado que la request tiene un token valido, listamos los usuarios de este usuario
        const userId = req.userData._id;

        // Recogemos de los parametros del request el Id del dispositivo a borrar
        const deviceId = req.query.deviceId;

        // Borramos el dispositivo y nos aseguramos que este asociado al usuario actual
        const result = await deviceModel.deleteOne({
            deviceId: deviceId,
            userId: userId
        });

        // Si se ha eliminado un dispositivo
        if (result.deletedCount > 0) {
            res.json({
                'status': 'success',
                'description': 'Dispositivo eliminado correctamente'
            });

            // Si no se ha eliminado ningun dispositivo
        } else {
            res.json({
                'status': 'fail',
                'description': 'No se ha encontrado el dispositivo a eliminar'
            });
        }

    } catch (error) {
        res.json({
            'status': 'fail',
            'error': error
        })
    }
});

// TODO: Caracteristica futura
// Actualizar informacion de uno o varios dispositivos
router.put("/devices", (req, res) => {

});

module.exports = router;