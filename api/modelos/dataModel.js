import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

// Esquema de dispositivo en la base de datos
const dataSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: [true]
    },
    userId: {
        type: String,
        required: [true]
    },
    temperatura: {
        type: Number,
        required: [true]
    },
    humedad: {
        type: Number,
        required: [true]
    },

    createdTime: {
        type: Number
    },

});

// Conversion de esquema a modelo. El string indica el nombre de la coleccion
const dataModel = mongoose.model('dato', dataSchema);

// Exportado del modelo para poder usarlo en otros codigos
export default dataModel;