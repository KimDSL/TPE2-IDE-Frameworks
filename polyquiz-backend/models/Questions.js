const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['F1', 'Moto GP', 'NBA', 'Manga', 'Anime']
    },
    text: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        required: true,
        validate: [(v) => v.length === 4, 'Il faut 4 options']
    },
    correctAnswer: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);