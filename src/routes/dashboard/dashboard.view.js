module.exports = (req, res) => {
    // res.send(req.verifiedUser)
    res.render('dashboard', { user: req.verifiedUser })
}