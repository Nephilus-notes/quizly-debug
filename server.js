const express = require('express')
const dotenv = require("dotenv")
const {connectDB} = require("./src/db")
const { graphqlHTTP } = require('express-graphql') //middleware that allows a connection
const schema = require('./src/graphql/schema')
const cookieParser = require('cookie-parser')
const { authenticate } = require('./src/middleware/auth')
const { userData } = require("./src/middleware/userData")


dotenv.config()

const app = express()

app.set('view engine', 'ejs')
app.set('views', './src/templates/views')

app.use(cookieParser())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true // visualizer
}))

app.use(authenticate)
app.use(userData)



connectDB()


app.use(express.urlencoded({ extended: true }))

/* Initialize our routes using the function imported from routes */
require('./src/routes')(app)

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})