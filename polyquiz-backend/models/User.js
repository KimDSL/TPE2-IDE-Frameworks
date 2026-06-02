const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    pseudo: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => !v.includes(' '),
            message: 'Le pseudo ne doit pas contenir d\'espaces'
        }
    },
    bestScore: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);