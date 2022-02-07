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
        console.log("[INFO]".magenta + "[Devices] ".blue + "Obteniendo informacion de los dispositivos ");

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
            console.log(device.deviceId)
            devices[index].saverRule = {
                'status': saverRules.filter(saverRule => saverRule.deviceId == device.deviceId)[0].status,
                'ruleId': saverRules.filter(saverRule => saverRule.deviceId == device.deviceId)[0].ruleId
            }
            // devices[index].saverRule.ruleId = saverRules.filter(saverRule => saverRule.deviceId == device.deviceId)[0]
        })
        console.log(devices)

        // Devolvemos los dispositivos encontrados
        if (devices != "undefined") {
            console.log("[OK]".green + "[Devices] ".blue + "Se han encontrado los dispositivos del usuario");
            res.json({
                'status': 'success',
                'description': 'Se han encontrado los siguientes dispositivos',
                'devices': devices
            })
        } else {
            console.log("[FAIL]".red + "[Devices] ".blue + "No se han encontrado los dispositivos del usuario");
            res.json({
                'status': 'fail',
                'error': "No se han encontrado dispositivos"
            })
        }
    } catch (error) {
        console.log("[FAIL]".red + "[Devices] ".blue + "Error: No se pudieron obtener los dispositivos: " + error);
        res.json({
            'status': 'fail',
            'error': error
        })
    }
});

// Crear nuevo dispositivo
router.post("/devices", comprobacionToken, async (req, res) => {
    try {
        console.log("[INFO]".magenta + "[Devices] ".blue + "Creando el dispositivo");


        // Recogemos los datos enviados por post
        var nuevoDispositivo = req.body.nuevoDispositivo;

        // Seleccionamos el id del usuario que esta logeado y que ha entrado en la request gracias a comprobacion Token
        var userId = req.userData._id;

        // metemos el userId en los datos a agregar en la coleccion de dispositivos
        nuevoDispositivo.userId = userId;

        // metemos el tiempo actual (createdTime) en los datos a agregar
        nuevoDispositivo.createdTime = Date.now();

        // Crear Saver Rule de EMQX para el dispositivo
        await createSaverRule(userId, nuevoDispositivo.deviceId, true);

        // Crear el nuevo dispositivo en la base de datos
        await deviceModel.create(nuevoDispositivo);



        // TODO: Comprobar que realmente se ha añadido antes de enviar la respuesta
        console.log("[OK]".green + "[Devices] ".blue + "Dispositivo añadido correctamente");

        res.json({
            'status': 'success',
            'description': 'Dispositivo añadido correctamente',
        });

    } catch (err) {
        console.log("[FAIL]".red + "[Devices] ".blue + "No se ha podido crear el dispositivo: " + err);
        res.json({
            'status': 'fail',
            'error': err
        });

    }
});

// Eliminar un dispositivo
router.delete("/devices", comprobacionToken, async (req, res) => {
    try {
        console.log("[INFO]".magenta + "[Devices] ".blue + "Intentando eliminar dispositivo ");

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


            console.log("[OK]".green + "[Devices] ".blue + "Dispositivo " + deviceId + " eliminado correctamente");

            res.json({
                'status': 'success',
                'description': 'Dispositivo eliminado correctamente'
            });

            // Si no se ha eliminado ningun dispositivo
        } else {

            console.log("[FAIL]".red + "[Devices] ".blue + "No se ha encontrado el dispositivoa eliminar: " + deviceId);

            res.json({
                'status': 'fail',
                'description': 'No se ha encontrado el dispositivo a eliminar'
            });
        }

    } catch (error) {
        console.log("[FAIL]".red + "[Devices] ".blue + "Error al eliminar dispositivo: " + error);
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
    try {
        console.log("[INFO]".magenta + "[Devices] ".blue + "Actualizando el estado de la Saver Rule ");

        let newSaverRule = req.body.newSaverRule;

        if (await updateSaverRule(newSaverRule.ruleId, newSaverRule.status)) {
            res.json({
                'status': 'success',
                'description': 'Dispositivo eliminado correctamente'
            });
        } else {
            throw "Error en la funcion updateSaverRule"
        }
    } catch (error) {
        console.log("[FAIL]".red + "[Devices] ".blue + "Error al actualizar el SaverRule: " + error);
        res.json({
            'status': 'fail',
            'error': error
        });
    }


});



// GET todas las reglas del usuario (desde la base de datos)
async function getSaverRules(userId) {
    try {
        // Se buscan todas las reglas correspondientes al usuario deseado
        const saverRules = await saverRuleModel.find({
            'userId': userId
        });

        if (saverRules) {
            console.log("[OK]".green + "[Devices] ".blue + "Se han encontrado las Saver Rules")
        }
        // Se devuelven las reglas encontradas
        return saverRules

    } catch (error) {
        console.log("[FAIL]".red + "[Devices] ".blue + "Error al intentar obtener las reglas de guardado: " + error)
        return false
    }
}

// POST crear una regla (Se llama al crear un dispositivo)
async function createSaverRule(userId, deviceId, status) {
    try {

        console.log("[INFO]".magenta + "[Devices] ".blue + "Creando la Saver Rule")

        // Endpoint de EMQX para crear reglas
        let url = "http://localhost:8085/api/v4/rules/";

        let hash = "1"

        let topic = "gardify" + "/" + userId + "/" + hash + "/" + deviceId + "/+/data";

        let sql = "SELECT topic, payload FROM \"" + topic + "\" WHERE payload.activo = 1";

        // TODO: Se puede prescindir del UserId puesto que esta contenido en el topic
        let payloadTemplate = '{"userId": "' + userId + '", "payload": ${payload}, "topic": "${topic}"}';

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

        // console.log(response.data)

        // Si se crea la regla correctamente, se guardara su ruleId en la bbdd
        if (response.status === 200 && response.data.data.id) {

            console.log("[OK]".green + "[Devices] ".blue + "Se han creado las Saver Rules. Almacenándolas en BBDD")
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
        console.log("[FAIL]".red + "[Devices] ".blue + "Error al crear la Saver Rule: " + error)
        return false
    }
}

// PUT Actualizar el estado 'activo' de una regla
async function updateSaverRule(ruleId, status) {
    try {

        console.log("[INFO]".magenta + "[Devices] ".blue + "Actualizando las Saver Rules")
        // Endpoint de EMQX para crear reglas
        let url = "http://localhost:8085/api/v4/rules/" + ruleId;

        let updatedRuleConfig = {
            enabled: status
        }

        // Llamada a la API de EMQX para actualizar la regla
        const response = await axios.put(url, updatedRuleConfig, emqx_API_Auth)

        // Si se crea la regla correctamente, se guardara su ruleId en la bbdd
        if (response.status === 200 && response.data.data.id) {

            console.log("[OK]".green + "[Devices] ".blue + "Se ha actualizado la Saver Rules. Actualizando en BBDD")

            // Se actualiza la regla en BBDD

            let result = await saverRuleModel.updateOne({
                'ruleId': ruleId,
            }, {
                'status': status
            });

            if (result.nModified == 1) {
                return true
            } else {
                throw "No se ha podido actualizar la regla en BBDD"
            }

        } else {
            return false
        }

    } catch (error) {
        console.log("[FAIL]".red + "[Devices] ".blue + "Error al  actualizar la Saver Rule: " + error)
        return false
    }

}

// DELETE Eliminar una regla
async function deleteSaverRule(deviceId) {
    try {
        console.log("[INFO]".magenta + "[Devices] ".blue + "Eliminando la Saver Rule")

        // Busacmos la Saver Rule y la borramos en la base de datos
        const ruleFound = await saverRuleModel.findOneAndDelete({
            'deviceId': deviceId
        })


        // Borramos la Saver Rule de EMQX
        let url = "http://localhost:8085/api/v4/rules/" + ruleFound.ruleId

        const response = await axios.delete(url, emqx_API_Auth)

        console.log("[OK]".green + "[Devices] ".blue + "Se ha eliminado la Saver Rule. Eliminando en BBDD")
        // TODO: Terminar eliminacion en BBDD

        return true

    } catch (error) {

        console.log("[FAIL]".red + "[Devices] ".blue + "No se ha podido eliminar la Saver Rule: " + error)
        return false

    }
}



module.exports = router;