// Librerias
const jwt = require('jsonwebtoken');

// Comprobación de que el token está correctamente firmado
let comprobacionToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, 'GardiFYHaSH2021', (err, decoded) => {

        // Si hay error de comprobacion de firma o la firma no es correcta
        if (err) {
            console.log("Error en autenticacion: " + err);
            return res.status(401).json({
                status: 'fail',
                error: err
            })

            // Si la firma del token es correcta
        } else {


            // Extraermos los datos del usuario del token y lo metemos en la request
            req.userData = decoded.userData;

            /* De esta manera hemos substituido los datos en la request del usuario, por los datos
            reales descodificados a partir del token, de forma que nos aseguramos de que el token tenga
            siempre datos correctos */

            next();


        }
    });

};

module.exports = {
    comprobacionToken
};