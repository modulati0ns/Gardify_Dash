// Librerias
const express = require('express');
const router = express.Router();
const axios = require('axios');

const {
    comprobacionToken
} = require('../middleware/tokenAuth.js');

const emqx_API_Auth = {
    auth: {
        username: 'admin',
        password: 'public'
    }
}

// Importar modelo de dipositivos y reglas
import deviceModel from '../modelos/deviceModel.js'
import saverRuleModel from '../modelos/saverRuleModel.js'

// CRUD de dispositivos

// Leer informacion de uno o varios dispositivos
router.get("/devices", comprobacionToken, async (req, res) => {
    try {

        // Ahora que hemos confirmado que la request tiene un token valido, listamos los usuarios de este usuario
        const userId = req.userData._id;

        // Obtener los dispositivos del usuario
        let devices = await deviceModel.find({
            userId: userId
        });

        // Desacoplamos la variabel devices del tiopo de objeto Arrayd e Mongoose a Array de JS
        devices = JSON.parse(JSON.stringify(devices));

        // Obtener SaverRules
        const saverRules = await getSaverRules(userId)



        // Cruzado de array de dispositivos con status del saverRule
        devices.forEach((device, index) => {
            devices[index].saverRule = {
                'status': saverRules.filter(saverRule => saverRule.deviceId == device.deviceId)[0].status,
                'ruleId': saverRules.filter(saverRule => saverRule.deviceId == device.deviceId)[0].ruleId
            }
            // devices[index].saverRule.ruleId = saverRules.filter(saverRule => saverRule.deviceId == device.deviceId)[0]

        })



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

        await createSaverRule(userId, nuevoDispositivo.deviceId, true);

        // TODO: Comprobar que realmente se ha añadido antes de enviar la respuesta
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
        console.log("Intentando eliminar dispositivo ");

        // Ahora que hemos confirmado que la request tiene un token valido, listamos los usuarios de este usuario
        const userId = req.userData._id;

        // Recogemos de los parametros del request el Id del dispositivo a borrar
        const deviceId = req.query.deviceId;

        await deleteSaverRule(deviceId)

        // Borramos el dispositivo y nos aseguramos que este asociado al usuario actual
        const result = await deviceModel.deleteOne({
            deviceId: deviceId,
            userId: userId
        });

        // Si se ha eliminado un dispositivo
        if (result.deletedCount > 0) {


            console.log("Dispositivo " + deviceId + " eliminado correctamente");

            res.json({
                'status': 'success',
                'description': 'Dispositivo eliminado correctamente'
            });

            // Si no se ha eliminado ningun dispositivo
        } else {

            console.log("No se ha encontrado el dispositivo: " + deviceId);

            res.json({
                'status': 'fail',
                'description': 'No se ha encontrado el dispositivo a eliminar'
            });
        }

    } catch (error) {
        console.log("Error al eliminar dispositivo: " + error);
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

// Actualizar el estado del saverRule para un dispositivo concreto
router.put("/deviceSaverRule", comprobacionToken, async (req, res) => {
    // let newSaverRule = req.body.newSaverRule;
    // let userId = req.body.

    // await updateSaverRule()

});



// GET todas las reglas del usuario (desde la base de datos)
async function getSaverRules(userId) {
    try {
        // Se buscan todas las reglas correspondientes al usuario deseado
        const saverRules = await saverRuleModel.find({
            'userId': userId
        });

        // Se devuelven las reglas encontradas
        return saverRules

    } catch (error) {
        console.log("Error al intentar obtener las reglas de guardado: " + error)
        return false
    }
}

// POST crear una regla (Se llama al crear un dispositivo)
async function createSaverRule(userId, deviceId, status) {

    try {

        // Endpoint de EMQX para crear reglas
        let url = "http://localhost:8085/api/v4/rules/";

        let hash = "1"

        let topic = "gardify" + "/" + userId + "/" + hash + "/" + deviceId + "/+/data";

        let sql = "SELECT topic, payload FROM \"" + topic + "\" WHERE payload.activo = 1";

        // TODO: Se puede prescindir del UserId puesto que esta contenido en el topic
        let payloadTemplate = '{"userId": "' + userId + '", "payload": ${paylaod}, "topic": "${topic}"}';

        let newRuleConfig = {
            "rawsql": sql,
            "actions": [{
                "name": "data_to_webserver",
                "params": {
                    $resource: global.saverResource.id,
                    "payload_tmpl": payloadTemplate,
                }
            }],
            "description": "Saver rule",
            "enabled": status
        };


        // Llamada a la API de EMQX para crear la regla
        const response = await axios.post(url, newRuleConfig, emqx_API_Auth)

        console.log(response.data)

        // Si se crea la regla correctamente, se guardara su ruleId en la bbdd
        if (response.status === 200 && response.data.data.id) {

            // Se crea el registro de la nueva regla en bbdd
            await saverRuleModel.create({
                'userId': userId,
                'deviceId': deviceId,
                'ruleId': response.data.data.id,
                'status': true
            })

            return true
        } else {
            return false
        }

    } catch (error) {
        console.log("Error al crear la regla de guardado: " + error)
        return false
    }
}

// PUT Actualizar el estado 'activo' de una regla
async function updateSaverRule(userId, deviceId, ruleId, status) {

    try {
        // Endpoint de EMQX para crear reglas
        let url = "http://localhost:8085/api/v4/rules/" + ruleId;

        let updatedRuleConfig = {
            enabled: status
        }

        // Llamada a la API de EMQX para actualizar la regla
        const response = await axios.put(url, updatedRuleConfig, emqx_API_Auth)

        // Si se crea la regla correctamente, se guardara su ruleId en la bbdd
        if (response.status === 200 && response.data.data.id) {

            // Se crea el registro de la nueva regla en bbdd
            await saverRuleModel.updateOne({
                'userId': userId,
                'deviceId': deviceId,
                'ruleId': ruleId,
            }, {
                'activo': status
            })
            return true
        } else {
            return false
        }

    } catch (error) {
        console.log("Error al  actualizar la regla de guardado: " + Error)
        return false
    }

}

// DELETE Eliminar una regla
async function deleteSaverRule(deviceId) {
    try {

        // Borramos la regla en la base de datos
        saverRuleModel.findOneAndDelete({
            'deviceId': deviceId
        })

        url = "http://localhost:8085/api/v4/rules" + ruleId

        const response = await axios.delete(url, emqx_API_Auth)

        return true

    } catch (error) {

        console.log("No se ha podido eliminar la relga: " + error)
        return false

    }
}



module.exports = router;