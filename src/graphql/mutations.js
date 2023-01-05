const { User, Quiz, Question, Submission } = require('../models')
const { QuestionInputType, AnswerInputType } = require('./types')
const { GraphQLString, GraphQLList, GraphQLNonNull } = require('graphql')
const { createJWTToken } = require('../util/auth')

const register = {
    type: GraphQLString,
    description: "Register new user",
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type:GraphQLString }
     },
     async resolve(parent, args) {

        const { username, email, password } = args

        const checkUser = await User.findOne({email})

        if (checkUser) {
            // return "User with that email already exists."

            throw new Error("User with that email already exists.")
        }

        const newUser = new User({
            username: username,
            email: email,
            password: password
        }) 

        await newUser.save()

        /* TODO: Generate web token */
        return createJWTToken(newUser)

     }
}

const login = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args) {
        // console.log(args)
        const { email, password } = args
        const user = await User.findOne({email})

        if (!user || password !== user.password) {
            throw new Error("Invalid credentials or user doesn't exist.")
        }

        /* TODO: Generate web tokens */
        
        return createJWTToken(user)
    }
}

const createQuiz = {
    type: GraphQLString,
    args: {
        questions: {
            type: new GraphQLList(QuestionInputType)
        },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        userId: { type: GraphQLString }
    },
    async resolve(parent, args) {
        /* */
        const slugify = args.title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/[' ']/g, '-')

        let fullSlug = ''

        while (true) {
            let slugId = Math.floor(Math.random()*1000000)

            fullSlug = `${slugify}-${slugId}`

            const existingQuiz = await Quiz.findOne({ slug:fullSlug })
            if (!existingQuiz){
                break
            }
        }

        const quiz = new Quiz({
            slug: fullSlug,
            title: args.title,
            description: args.description,
            userId: args.userId
        })

        await quiz.save()

        for (const question of args.questions) {
            const questionObj = new Question({
                title: question.title,
                correctAnswer: question.correctAnswer,
                order: question.order,
                quizId: quiz.id
            })
            questionObj.save()
        }
        return quiz.slug
    }
}

const submitQuiz = {
    type: GraphQLString,
    args: {
        answers: {
            type: new GraphQLList(AnswerInputType)
        },
        userId: { type: GraphQLString },
        quizId: { type: GraphQLString }
    },
    async resolve(parent, args) {
        let correct = 0

        for (const answer of args.answers) {
            const question = await Question.findById(answer.questionId)

            if (question.correctAnswer.trim().toLowerCase() 
                == answer.answer.trim().toLowerCase()) {
                    correct ++
                }
        }
        const score = (correct/args.answers.length) * 100

        const submission = new Submission({
            userId: args.userId,
            quizId: args.quizId,
            score
        })

        await submission.save()

        return submission.id
    }
}

module.exports = {
    register,
    login,
    createQuiz,
    submitQuiz
}