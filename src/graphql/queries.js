const { GraphQLList, GraphQLID, GraphQLString } = require('graphql')

const { UserType, QuizType, SubmissionType } = require('./types')
const { User, Quiz, Submission } = require('../models')
// Only need to go to models because we packaged the models into a single object in the index.js of models

const users = {
    type: new GraphQLList(UserType),
    description: 'Query all users from the database',
    resolve(parent, args) {
        return User.find()
    }
}

const user = {
    type: UserType,
    description: "Query a user by their ID",
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent, args) {
        return User.findOne({ id:args.id })
    }
}

const quizBySlug = {
    type: QuizType,
    description: "Query a quiz by it's slug",
    args: {
        slug: { type: GraphQLString }
    },
    resolve(parents, args) {
        console.log("quiz Found")
        return Quiz.findOne({
            slug: args.slug
        })
    }
}

const submission = {
    type: SubmissionType,
    description: 'Query a submission by its ID',
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent, args) {
        return Submission.findById(args.id)
    }
}

module.exports = {
    users,
    user,
    quizBySlug,
    submission
}