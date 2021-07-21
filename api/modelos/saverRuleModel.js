import mongoose from 'mongoose';
const uniqueValidator = require('mongoose-unique-validator');

// Esquema de saverRule en la base de datos
const saverRuleSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true]
    },
    deviceId: {
        type: String,
        required: [true]
    },
    ruleId: {
        type: String,
        required: [true],
        unique: true
    },
    status: {
        type: Boolean,
        required: [true]
    },
});

// Validador de email
saverRuleSchema.plugin(uniqueValidator, {
    message: 'Error. El email ya existe'
});

// Conversion de esquema a modelo. El string indica el nombre de la coleccion
const saverRuleModel = mongoose.model('saverRule', saverRuleSchema);

// Exportado del modelo para poder usarlo en otros codigos
export default saverRuleModel;