// Librerías
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Instanciación de ExpressJs y configuracion
const api = express();
api.use(express.json());
api.use(express.urlencoded({
    extended: true
}));
api.use(cors());

// modulos de la API de Gardigy V1
api.use("/gfyapiv1", require("./routes/devices.js"));
api.use("/gfyapiv1", require("./routes/users.js"));
api.use("/gfyapiv1", require("./routes/auth.js"));
api.use("/gfyapiv1", require("./routes/plantWidget.js"));
api.use("/gfyapiv1", require("./routes/toEmqx.js"));
api.use("/gfyapiv1", require("./routes/fromEmqx.js"));

// Linea para modulos por partes
module.exports = api;

// Servidor en el puerto 1996
api.listen(1996, () => {
    console.log("escuchando en 1996");
});



// Conexion a MongoDB
const mongoUsername = "adminGardifyMongo";
const mongoPassword = "developement";
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDatabase = "Gardify";

// Uri de conexion a Mongo
var uri =
    "mongodb://" +
    mongoUsername +
    ":" +
    mongoPassword +
    "@" +
    mongoHost +
    ":" +
    mongoPort +
    "/" +
    mongoDatabase;

// Opciones de conexion a MongoDB
const mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    authSource: "admin"
}

// Conexion a mongo
mongoose.connect(uri, mongoOptions).then(() => {
    console.log("Conexion a MongoDB exitosa");
}, (err) => {
    console.log("Error en la conexion a MongoDB: " + err);
});