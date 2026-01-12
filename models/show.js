const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },
    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screen',
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    showTime: {
        type: String,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    }
});

const Show = mongoose.model('Show', showSchema);
module.exports = Show;
