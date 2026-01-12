const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater',
        required: true
    },
    screenName: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    screenType: {
        type: String,
        default: 'Standard'
    }
});

const Screen = mongoose.model('Screen', screenSchema);
module.exports = Screen;
