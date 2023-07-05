const mongoose = require('mongoose')
const {schemaOptions} = require('./modelOption')

const userSchema = new mongoose.Schema({
    idNumber: {
        type: String,
        require: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        require: true,
        unique: true,
    },
    fullName : {
        type: String,
        require: true,
    },
    address: {
        type: String
    }
}, schemaOptions)

module.exports = mongoose.model('User', userSchema);
