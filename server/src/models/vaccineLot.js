const mongoose = require('mongoose');
const {schemaOptions} = require('./modelOption');
const Schema = mongoose.Schema;

const vaccineLotSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true,
    },
    quantity: {
        type: Number,
        require: true,
    },
    vaccinated: {
        type: Number,
        require: true,
        default: 0
    },
    vaccine: {
        type: Schema.Types.ObjectId,
        ref: 'Vaccine',
        require: true,
    },
}, schemaOptions)

module.exports = mongoose.model('VaccineLot', vaccineLotSchema);
