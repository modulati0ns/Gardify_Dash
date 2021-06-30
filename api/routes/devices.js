const express = require('express');
const router = express.Router();

router.get("/test", (req, res) => {
    res.send("Hola");
});

// CRUD de dispositivos

// Leer informacion de uno o varios dispositivos
router.get("/devices", (req, res) => {

});

// Crear nuevo dispositivo
router.post("/devices", (req, res) => {

});

// Eliminar un dispositivo
router.delete("/devices", (req, res) => {

});

// Actualizar informacion de uno o varios dispositivos
router.put("/devices", (req, res) => {

});

module.exports = router;