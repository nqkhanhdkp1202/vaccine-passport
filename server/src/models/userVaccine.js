const mongoose = require('mongoose')
const {schemaOptions} = require('./modelOption')
const Schema = mongoose.Schema

const userVaccineSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    vaccine: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Vaccine'
    },
    vaccineLot: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'VaccineLot'
    }
}, schemaOptions)

module.exports = mongoose.model('UserVaccine', userVaccineSchema);
