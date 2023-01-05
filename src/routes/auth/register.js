const axios = require('axios')

module.exports = async (req, res)=> {
    if (req.body.password !== req.body.confirmPassword) {
        res.redirect('auth/register')
    }

    const mutation = `
    mutation register ($email: String!, $username: String!, $password: String!){
        register(email: $email, username:$username, password: $password)
    }
`
    console.log("grabbing data")
try {
    const { data }= await axios.post(process.env.GRAPHQL_ENDPOINT, {
        query: mutation,
        variables: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }
    }, {
        headers: {
            'Content-Type': "application/json"
        }
    })
    // console.log(data.data.register)
    res.cookie('jwtToken', data.data.register, { maxAge: 2592000000, httpOnly: true })
    res.redirect('/')
} catch(e) {
    res.send(e)
}
}