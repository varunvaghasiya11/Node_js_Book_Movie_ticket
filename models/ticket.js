const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    showId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Show',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seatNumber: {
        type: String,
        required: true
    },
    bookingDate: {
        type: Date,
        default: Date.now()
    },
    price: {
        type: Number,
        required: true
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
