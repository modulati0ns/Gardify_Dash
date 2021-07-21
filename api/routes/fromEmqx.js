const express = require('express');
const router = express.Router();
const axios = require('axios');

// Importar modelo de usuarios
// import plantWidgetModel from '../modelos/plantWidgetModel.js'

/* Estos endopoints han de ser todos llamados mediante solicitudes POST
    y son los encargados de interactuar con el sistema de reglas de EMQX
    Es el nombre debe estar formado por: /emqxrule+{descripcion}*/


// Endpoint que recibe los mensajes de EMQX
router.post('/emqxsaver', async (req, res) => {
    try {

        const message = req.body;
        console.log(message)

        res.json({
            'status': 'success',
        })

    } catch (error) {

    }

});


module.exports = router;