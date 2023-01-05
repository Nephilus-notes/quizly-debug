const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    quizId: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('question', questionSchema)