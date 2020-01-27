const mongoose = require('mongoose')
const validator = require('validator')

const equipSchema = new mongoose.model({
    name: {
        type: String,
        required : true
    },
    detail: {
        type: String
    },
    image: {
        type: String
    }
}, {
    toJSON: {virtuals : true},
    toObject: {virtuals: true},
    timestamps: true
})

const Equipments = mongoose.model('Equipments', equipSchema)

module.exports = Equipments