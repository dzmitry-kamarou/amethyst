if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const PORT = process.env.PORT || 3000;
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const app = express();
const expressEjsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME
// non-local
const connectionString = `mongodb+srv://${username}:${password}@cluster0.tw2pd.mongodb.net/${database}?retryWrites=true&w=majority`
// local
// const connectionString = `mongodb://localhost:27017/${database}`
require("./config/passport")(passport)
// mongoose
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('connected...'))
    .catch((err) => console.log(err));
// EJS
app.set('view engine', 'ejs');
app.use(expressEjsLayout);
// BodyParser
app.use(express.urlencoded({extended: false}));
app.use(express.json());
//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
//use flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.listen(PORT)