const express = require('express');
const objectId = require("mongodb").ObjectID;
const router = express.Router();
const User = require("../models/user.js")
const bcrypt = require('bcrypt');
const passport = require('passport');
// login handle
router.get('/login', (req, res) => {
    res.render('login');
})
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})
router.get('/register', (req, res) => {
    res.render('register');
})
// register handle
router.post('/login', (req, res) => {
})
router.delete('/:id', (req, res) => {
    const id = new objectId(req.params.id);
    User.findOneAndDelete({_id: id}, function (err, result) {
        if (err) return console.log(err);
        if (!result) {
            res.json({message: 'Already deleted'});
        } else {
            res.json({message: 'Deleted'});
        }
    });
});
router.post('/register', (req, res) => {
    const {firstName, lastName, email, password, password2} = req.body;
    let errors = [];
    console.log('First Name ' + firstName + 'Last Name ' + lastName + ' email :' + email + ' pass:' + password);
    if (!firstName || !lastName || !email || !password || !password2) {
        errors.push({msg: "Please fill in all fields"})
    }
    //check if match
    if (password !== password2) {
        errors.push({msg: "passwords don't match"});
    }
    //check if password is more than 6 characters
    if (password.length < 6) {
        errors.push({msg: 'password atleast 6 characters'})
    }
    if (errors.length > 0) {
        res.render('register', {
            errors: errors,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            password2: password2
        })
    } else {
        // validation passed
        User.findOne({email: email}).exec((err, user) => {
            console.log(user);
            if (user) {
                errors.push({msg: 'email already registered'});
                res.render('register', {errors, firstName, lastName, email, password, password2});
            } else {
                const newUser = new User({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password
                });
                //hash password
                bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt,
                        (err, hash) => {
                            if (err) throw err;
                            //save pass to hash
                            newUser.password = hash;
                            //save user
                            newUser.save()
                                .then((value) => {
                                    console.log(value)
                                    req.flash('success_msg', 'You have now registered!')
                                    res.redirect('/users/login');
                                })
                                .catch(value => console.log(value));
                        }));
            }
        })
    }
})
// logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Now logged out');
    res.redirect('/');
})

router.get('/', (req, res) => {
    let email = req.query.email;
    User.findOne({email: email}).exec((err, user) => {
        res.json(user)
    })
})

module.exports = router;