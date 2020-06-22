const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), 'server', '.env') });
var createError = require('http-errors');
var express = require('express');
var logger = require('morgan');
const passport = require('passport');
const cors = require('cors');

// var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const uploadRouter = require('./routes/uploadRouter');
const favoriteRouter = require('./routes/favoriteRouter');
const commentRouter = require('./routes/commentRouter');

const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'),
    err => console.log(err)
);

var app = express();
app.use(cors());

// Secure traffic only
// app.all('*', (req, res, next) => {
//     if (req.secure) {
//         return next();
//     } else {
//         console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
//         res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
//     }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

const root = path.join(__dirname, '../react-ui', 'build');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(root));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);
app.use('/comments', commentRouter);

app.get("*", (req, res) => {
    res.sendFile('index.html', { root });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;