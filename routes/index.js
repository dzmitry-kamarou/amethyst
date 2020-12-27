// Source example: https://medium.com/better-programming/build-a-login-system-in-node-js-f1ba2abd19a
const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require("../config/auth.js")
router.get('/', (req, res) => {
    res.render('welcome');
})
router.get('register', (req, res) => {
    res.render('register')
})
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    console.log(req);
    res.render('dashboard', {user: req.user});
})
module.exports = router;