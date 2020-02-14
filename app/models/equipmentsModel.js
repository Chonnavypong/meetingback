const mongoose = require('mongoose')
const validator = require('validator')

const equipSchema = new mongoose.Schema({
    name: {
        type: String,
        // required : true
    },
    detail: {
        type: String
    },
    photoCover: {
        type: String
    },
    photo: {
        type: String
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})

const Equipments = mongoose.model('Equipments', equipSchema)

module.exports = Equipments