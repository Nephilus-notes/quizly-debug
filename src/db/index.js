`hosts a function that will connect server to db`

const mongoose = require('mongoose')

const connectDB = async function() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected")
}

module.exports= {
    connectDB
}