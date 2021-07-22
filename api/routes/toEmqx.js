const express = require('express');
const router = express.Router();
const axios = require('axios');



/* Estos endopoints han de ser todos llamados mediante solicitudes POST
    y son los encargados de interactuar con el sistema de reglas de EMQX
    Es el nombre debe estar formado por: /emqx+{descripcion}*/


// Variables locales

const emqx_API_Auth = {
    auth: {
        username: 'admin',
        password: 'public'
    }
}

// Variables globales (Se comparten en todo el backend)

global.saverResource = null;
global.alarmResource = null;


// Gestor de recursos de EMQX

async function getAllResources() {
    try {
        console.log("[INFO]".magenta + "[EMQX] ".blue + "Obteniendo los recursos de EMQX")


        const url = 'http://localhost:8085/api/v4/resources'

        // Llamada mediante promesas para evitar congestionar a Node
        const response = await axios.get(url, emqx_API_Auth)

        if (response.status == 200) {
            var resources = response.data.data

            // Almacenamos en las variables globales los recursos de saver y alarm
            global.alarmResource = resources.find(resource => resource.id == "alarm_resource")
            global.saverResource = resources.find(resource => resource.id == "saver_resource")

            console.log("[OK]".green + "[EMQX] ".blue + "Se han encontrado correctamente los recursos de API")

            // Si alguno de los dos recursos no hubiese sido encontrado, se llama a createResources()
            if (global.alarmResource == null || global.saverResource == null) {
                console.log("[Warning]".yellow + "[EMQX] ".blue + "No se han encontrado los recursos de API. Se procederá a crearlos")
                createResources();
            }
        } else {
            throw "No se ha podido llamar a la API de EMQX"
        }

    } catch (error) {
        console.log("[FAIL]".red + "[EMQX] ".blue + "Error al encontrar los recursos: " + error)
    }


}


// Function para crear los recursos Saver y Alarm
async function createResources() {
    try {
        console.log("[INFO]".magenta + "[EMQX] ".blue + "Creando los recursos de EMQX API")

        const url = 'http://localhost:8085/api/v4/resources'

        // Se definen los recursos a crear
        const dataSaverResource = {
            type: "web_hook",
            id: "saver_resource",
            config: {
                url: "http://localhost:1996/gfyapiv1/emqxsaver",
                headers: {
                    token: "121212"
                },
                method: "POST",
            },
            description: "API de Gardify para configurar el saver"
        }

        const dataAlarmResource = {
            type: "web_hook",
            id: "alarm_resource",
            config: {
                url: "http://localhost:1996/gfyapiv1/emqxalarm",
                headers: {
                    token: "121212"
                },
                method: "POST",
            },
            description: "API de Gardify para configurar las alarmas"
        }

        // Se realizan las peticiones de creacion de los recursos
        const response1 = await axios.post(url, dataSaverResource, emqx_API_Auth)
        const response2 = await axios.post(url, dataAlarmResource, emqx_API_Auth)

        if (response1.status === 200 && response2.status === 200) {
            // Una vez que se han creado correctamente los recursos, volvemos  a almacenarlos en variables globales
            console.log("[OK]".green + "[EMQX] ".blue + "Recursos creados correctamente")

            getAllResources();


        } else {
            throw "No se han podido crear los recursos correctamente"
        }

    } catch (error) {
        console.log("[FAIL]".red + "[EMQX] ".blue + "Error al crear los recursos: " + error)

    }



}


getAllResources();




module.exports = router;