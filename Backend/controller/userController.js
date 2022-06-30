const { model } = require('mongoose');
const User = require('../Models/user')

module.exports.Register = async (req, res) => {
    const { username, passport } = req.body;

    try {
        const user = new User({ username, passport });
        const registered = await (User.register(user, passport));
        req.login(registered, err => {
            if (err) return next(err);
            res.send('success')
        })
    } catch (e) {
        req.send('failure');
    }
}

module.exports.login = (req, res, next) => {

}

module.exports.logout = (req, res) => {
    req.logout();
    res.send('logged out')
}