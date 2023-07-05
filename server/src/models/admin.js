const mongoose = require('mongoose')
const {schemaOptions} = require('./modelOption')

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    }
}, schemaOptions)

module.exports = mongoose.model('Admin', adminSchema);
