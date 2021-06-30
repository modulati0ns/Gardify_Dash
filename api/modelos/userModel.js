import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

// Esquema de usuarios en la base de datos
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true]
    },
    apellidos: {
        type: String,
        required: [true]
    },
    // direccion: {
    //     type: String,
    //     required: [true]
    // },
    email: {
        type: String,
        required: [true],
        unique: true
    },
    password: {
        type: String,
        required: [true]
    },
});

// Validador de email
userSchema.plugin(uniqueValidator, {
    message: 'Error. El email ya existe'
});

// Conversion de esquema a modelo. El string indica el nombre de la coleccion
const userModel = mongoose.model('usuario', userSchema);

// Exportado del modelo para poder usarlo en otros codigos
export default userModel;