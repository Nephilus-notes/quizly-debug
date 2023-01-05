// const mongoose = `mongoose.set('strictQuery', false);`

module.exports = {
    Question: require('./question.model'),
    Quiz: require('./quiz.model'),
    Submission: require('./submission.model'),
    User: require('./user.model')
}