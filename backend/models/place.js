const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
    name: { type: String, required: true },

    state: { type: String, required: true },
    district: { type: String, required: true },

    category: { type: String },
    image: { type: String },
    description: { type: String },

    lat: { type: Number },
    lng: { type: Number },

    bestTime: { type: String },
    crowd: { type: String },
    duration: { type: String },

    isFamous: { type: Boolean, default: false }
});

module.exports = mongoose.model('Place', PlaceSchema);