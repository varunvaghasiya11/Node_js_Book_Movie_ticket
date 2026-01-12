const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    runtime_h: {
        type: Number,
        required: true
    },
    runtime_m: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
