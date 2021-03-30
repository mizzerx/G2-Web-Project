const express = require('express');
const dotenv = require('dotenv');
const logger = require('morgan');
const passport = require('passport');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passportConfig = require('./configs/passport.config');
const { createConnection } = require('./configs/database.config');

const indexRouter = require('./routes/index.route');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const facultyRouter = require('./routes/faculty.route');

global.__dirname = path.resolve('./');
dotenv.config();

const app = express();

/** Connect DB */
createConnection();

/** Template engine set up */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', exphbs({ defaultLayout: 'default', extname: 'html' }));

/** Express middleware config */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

/** Passport config */
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

/** Express session config */
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

/** Routes */
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/faculties', facultyRouter);

/** Catch 404 Error and forward it to error handler */
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

/** Error handler */
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};

  // Render error
  return res
    .status(error.status || 500)
    .render('error', { error, layout: false });
});

module.exports = app;
