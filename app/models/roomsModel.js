const mongoose = require('mongoose')
const validator = require('validator')

const roomsShema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number
    },
    detail: {
        type: String
    },
    image: {
        type: String
    }
}, {
    timestamps : true,
    toJSON: {virtuals : true},
    toObject: {virtuals: true}
})

const Rooms = mongoose.model('Rooms', roomsShema)

module.exports = Rooms