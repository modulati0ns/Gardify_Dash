import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

// Esquema de dispositivo en la base de datos
const deviceSchema = new mongoose.Schema({
    deviceName: {
        type: String,
        required: [true]
    },
    deviceId: {
        type: String,
        unique: true,
        required: [true]
    },
    userId: {
        type: String,
        required: [true]
    },
    // activo: {
    //     type: Boolean,
    //     required: [true],
    //     default: true
    // },
    createdTime: {
        type: Number
    },

});

// Validador de id del dispositivo
deviceSchema.plugin(uniqueValidator, {
    message: 'Error. El dispositivo ya está registrado'
});

// Conversion de esquema a modelo. El string indica el nombre de la coleccion
const deviceModel = mongoose.model('dispositivo', deviceSchema);

// Exportado del modelo para poder usarlo en otros codigos
export default deviceModel;