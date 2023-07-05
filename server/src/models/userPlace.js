const mongoose = require('mongoose')
const {schemaOptions} = require('./modelOption')
const Schema = mongoose.Schema;

const userPlaceSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    place: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        require: true,
    },
}, schemaOptions)

module.exports = mongoose.model('UserPlace', userPlaceSchema);
