let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');


let authRouter = require('./routes/auth');
let userRouter = require('./routes/user');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const db = require('./config/keys').mongoURI;

mongoose.connect(db, {useNewUrlParser: true})
    .then(()=> console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

app.use(passport.initialize());
require('./config/passport')(passport);

app.use(cors());
app.options('*', cors());
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
    errors: err.message
  })
});

module.exports = app;
