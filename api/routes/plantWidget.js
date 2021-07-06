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

    } catch (err) {

        console.log("ERROR. No se ha podido configurar los widgets. Razon: " + err);

        // Devolucion de error 500 en el registro y el error para detectar si el email es unico
        res.status(500).json({
            'status:': 'fail',
            'error': err
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
                'plantWidgets': plantWidgets[0].widgets
            })
        } else {

            // TODO: En plan para funcionar para usuarios antiguos, se podria ahcer que si no se encuentra el array de widget para ese usuario, crearlo aqui
            res.json({
                'status': 'fail',
                'error': "No se ha encontrado el array de widgets"
            })
        }
    } catch (error) {
        res.json({
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
        var widget = req.body.widget;


        // Insertar configuracion del Widget en la base de datos
        await plantWidgetModel.updateOne({
            'userId': userId
        }, {
            'widgets': widget
        });

        // TODO: Se deberia comprobar aqui si de verdad se ha creado lo de los widgets y sino hacer un rollback para eliminar el usuario
        console.log("Se han actualizado los widgets correctamente")
        // Devolucion de usuario registrado correctamente
        res.json({
            'status': 'success',
            'description': 'Se han actualizado los widgets correctamente',
        })

    } catch (err) {

        console.log("ERROR. No se han podidoactualizarlos widgets. Razon: " + err);

        // Devolucion de error 500 en el registro y el error para detectar si el email es unico
        res.status(500).json({
            'status:': 'fail',
            'error': err
        })
    }

});


// // Endpoint de Login
// router.post('/login', async (req, res) => {
//     try {

//         // Recogemos los datos de POST
//         const userToLogin = req.body;

//         // Busqueda de usuario en la base de datos por email
//         var foundUser = await userModel.findOne({
//             email: userToLogin.email
//         });

//         // Si no se encuentra el usuario en la base de datos
//         if (!foundUser) {
//             throw "Login incorrecto";

//             // Si se encuentra el usuario
//         } else {

//             // Comprobación de contraseña
//             if (bcrypt.compareSync(userToLogin.password, foundUser.password)) {
//                 // Contraseña correcta

//                 // Eliminamos la contraseña de la variable usuario encontrado para que no aaprezca en el token
//                 foundUser.set('password', undefined, {
//                     strict: false
//                 });

//                 // Generacion de token a partir de los datos del login
//                 const token = jwt.sign({
//                     userData: foundUser
//                 }, 'GardiFYHaSH2021', {
//                     expiresIn: 3600 * 24
//                 });

//                 // Si el token es correcto se inicia la sesión
//                 if (token) {
//                     console.log("Sesion iniciada correctamente");
//                     // Devolucion de login correcto y token
//                     return res.json({
//                         'status': 'success',
//                         'description': 'Sesion iniciada correctamente',
//                         'token': token,
//                         'userData': foundUser
//                     });
//                 }



//             } else {
//                 // Contraseña incorrecta
//                 throw "Login incorrecto";
//             }
//         }
//     } catch (err) {
//         console.log("Hubo un fallo en el inicio se sesion");
//         res.status(401).json({
//             'status': 'fail',
//             'description': 'Hubo un fallo en el inicio de sesion',
//             'error': err
//         });
//     }

// });




module.exports = router;