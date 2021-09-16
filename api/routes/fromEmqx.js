const express = require('express');
const router = express.Router();
const axios = require('axios');


import dataModel from "../modelos/dataModel"
import deviceModel from "../modelos/deviceModel"
/* Estos endopoints han de ser todos llamados mediante solicitudes POST
    y son los encargados de interactuar con el sistema de reglas de EMQX
    Es el nombre debe estar formado por: /emqxrule+{descripcion}*/


// Endpoint que recibe los mensajes de EMQX y los guarda en BBDD
router.post('/emqxsaver', async (req, res) => {
    try {


        // Compruebo que la peticion me llega con el token del Resource de EMQX correcto
        if (req.headers.token != 121212) {
            throw ("El token del mensaje recibido no es valido")
        } else {
            var payload = req.body.payload
            var deviceOfMessage = await deviceModel.find({
                "deviceId": payload.deviceId,
                "userId": payload.userId
            })

            // Se comprueba que 
            if (deviceOfMessage.length == 1) {
                dataModel.create({
                    "deviceId": payload.deviceId,
                    "userId": payload.userId,
                    "temperatura": payload.temperatura,
                    "humedad": payload.humedad,
                    "createdTime": Date.now(),
                })
            } else {
                throw ("El numero de dispositivos encontrados no es valido")
            }

            res.sendStatus(200)
        }

    } catch (error) {
        console.log("[FAIL]".red + "[fromEMQX] ".blue + "Error: " + error)
    }

});


module.exports = router;