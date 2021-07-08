import mongoose from 'mongoose';

// Esquema de dispositivo en la base de datos
const plantDeviceSchema = new mongoose.Schema({
    // nombre: {
    //     type: String,
    //     required: [true]
    // },
    // deviceId: {
    //     type: String,
    //     required: [true]
    // },
    userId: {
        type: String,
        required: [true],
        unique: true
    },
    // plantId: {
    //     type: String,
    //     required: [false]
    // }

    widgets: {
        type: Array,
        required: [true],
        default: []
    }

});



// Conversion de esquema a modelo. El string indica el nombre de la coleccion
const plantWidgetModel = mongoose.model('widgetPlanta', plantDeviceSchema);

// Exportado del modelo para poder usarlo en otros codigos
export default plantWidgetModel;