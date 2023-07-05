const mongoose = require('mongoose')
const {schemaOptions} = require('./modelOption')
const Schema = mongoose.Schema;

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    address: {
        type: String,
        require: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }
}, schemaOptions)

module.exports = mongoose.model('Place', placeSchema);
