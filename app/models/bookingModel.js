const mongoose = require('mongoose')
const validator = require('validator')

const bookingShema = new mongoose.Shema({
    title: {
        type: String,
    },
    detail: {
        type: String
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['available', 'not available']
    },
    users: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users'
    },
    rooms: {
        type: mongoose.Shema.ObjectId,
        ref: 'Rooms'
    },
    equipments: [{
        type: mongoose.Shema.ObjectId,
        ref: 'Equipments'
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

const Booking = mongoose.model('Booking', bookingShema)

module.exports = Booking