const express = require('express');
const router = express.Router();

const {
    comprobacionToken
} = require('../middleware/tokenAuth.js');

// Importar modelo de usuarios
import plantWidgetModel from '../modelos/plantWidgetModel.js'


// Endpoint para crear los widgets. Se ha de ejecutar cuando se realice el registro de la persona.
router.post('/plantWidget', async (req, res) => {
    try {


        // Ahora que hemos confirmado que la request tiene un token valido, obtenemos su Id
        const userId = req.body.userId;

        // Array de configuraciones de los widgets
        const widgets = [{
                'nombre': "",
                'deviceId': "",
                'plantId': "",
                'position': 1
            },
            {
                'nombre': "",
                'deviceId': "",
                'plantId': "",
                'position': 2

            },
            {
                'nombre': "",
                'deviceId': "",
                'plantId': "",
                'position': 3

            },
            {
                'nombre': "",
                'deviceId': "",
                'plantId': "",
                'position': 4

            },
        ]

        // Insertar configuracion del Widget en la base de datos
        await plantWidgetModel.create({
            userId: userId,
            widgets: widgets,
        });

        // TODO: Se deberia comprobar aqui si de verdad se ha creado lo de los widgets y sino hacer un rollback para eliminar el usuario
        console.log("Configuracion incial de widgets almacenada correctamente")
        // Devolucion de usuario registrado correctamente
        res.json({
            'status': 'success',
            'description': 'Configuracion incial almacenada correctamente',
        })

    } catch (error) {

        console.log("ERROR. No se ha podido configurar los widgets. Razon: " + err);

        // Devolucion de error 500 en el registro y el error para detectar si el email es unico
        res.status(500).json({
            'status:': 'fail',
            'error': error
        })
    }

});

// Endpoint para obtener los widget. Se llama en el mounted del index
router.get('/plantWidget', comprobacionToken, async (req, res) => {
    try {

        // Ahora que hemos confirmado que la request tiene un token valido, listamos los usuarios de este usuario
        const userId = req.userData._id;

        // Obtener los dispositivos del usuario
        const plantWidgets = await plantWidgetModel.find({
            userId: userId
        });


        // Devolvemos el array de widgets encontrado
        if (plantWidgets.length != 0) {
            res.json({
                'status': 'success',
                'description': 'Se han encontrado el array de widgets',
                'widgets': plantWidgets[0].widgets
            })
        } else {

            // TODO: En plan para funcionar para usuarios antiguos, se podria ahcer que si no se encuentra el array de widget para ese usuario, crearlo aqui
            res.json({
                'status': 'fail',
                'error': "No se ha encontrado el array de widgets"
            })
        }
    } catch (error) {
        res.status(500).json({
            'status': 'fail',
            'error': error
        })
    }
});

// Endpoint para actualziar los widget. Se llama al pulsar el boton
router.put('/plantWidget', comprobacionToken, async (req, res) => {
    try {


        // Ahora que hemos confirmado que la request tiene un token valido, obtenemos su Id
        const userId = req.userData._id;

        // Sacar el array datos del body
        var widgets = req.body.widgets;


        // Insertar configuracion del Widget en la base de datos
        await plantWidgetModel.updateOne({
            'userId': userId
        }, {
            'widgets': widgets
        });

        // TODO: Se deberia comprobar aqui si de verdad se ha creado lo de los widgets y sino hacer un rollback para eliminar el usuario
        console.log("Se han actualizado los widgets correctamente")
        // Devolucion de usuario registrado correctamente
        res.json({
            'status': 'success',
            'description': 'Se han actualizado los widgets correctamente',
        })

    } catch (error) {

        console.log("ERROR. No se han podidoactualizarlos widgets. Razon: " + err);

        // Devolucion de error 500 en el registro y el error para detectar si el email es unico
        res.status(500).json({
            'status:': 'fail',
            'error': error
        })
    }

});

// Endpoint para actualziar los widget. Se llama al pulsar el boton
router.delete('/plantWidget', comprobacionToken, async (req, res) => {
    try {


        // Ahora que hemos confirmado que la request tiene un token valido, obtenemos su Id
        const userId = req.userData._id;


        // ME HE QUEDADO AQUI CON EL PROBELMA DE QUE SE HA METIDO UN STRING A LA BASE DE DATOS. A VER DESDE DONDE LLEGA Y SI EL JSON() LO SOLUCIONA
        const widgets = []
        const positions = []
        for (var i = 0; i < 4; i++) {
            widgets[i] = JSON.parse(req.query.widgets[i])
            positions[i] = JSON.parse(req.query.positions[i])
        }


        // console.log("Me han llegado" + positions)
        // console.log(req.query.widgets)

        for (var i = 0; i < widgets.length; i++) {
            if (widgets[i].position == positions[i]) {
                widgets[i].deviceId = "";
                widgets[i].deviceName = "";
                widgets[i].plantId = "";
            }
        }
        console.log(widgets)



        // Insertar configuracion del Widget en la base de datos
        await plantWidgetModel.updateOne({
            'userId': userId
        }, {
            'widgets': widgets
        });

        // TODO: Se deberia comprobar aqui si de verdad se ha creado lo de los widgets y sino hacer un rollback para eliminar el usuario
        console.log("Se han eliminado los widgets correctamente")
        // Devolucion de usuario registrado correctamente
        res.json({
            'status': 'success',
            'description': 'Se han eliminado los widgets correctamente',
        })

    } catch (error) {

        console.log("ERROR. No se han podido eliminar los widgets. Razon: " + error);

        // Devolucion de error 500 en el registro y el error para detectar si el email es unico
        res.status(500).json({
            'status:': 'fail',
            'error': error
        })
    }

});

module.exports = router;