const express = require('express');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use('/v1', helmet());

// parse json request body
app.use('/v1', express.json({ limit: '200mb' }));

// parse urlencoded request body
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// sanitize request data
app.use('/v1', xss());
app.use('/v1', mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'http://bd4142108316.ngrok.io',
    'http://localhost:19006',
    'https://103.170.123.13:3001',
    'http://103.170.123.13:3001',
    'http://nihongo365.com',
    'https://nihongo365.com',
    'http://www.nihongo365.com',
    'https://www.nihongo365.com',
    '103.170.123.13',
    '103.170.123.13:3001',
    'nihongo365.com',
    'www.nihongo365.com',
    'app.nihongo365.com',
    'https://app.nihongo365.com',
    'http://app.nihongo365.com',
    'localhost:3000',
    'localhost:3001',
    '192.168.1.244:3000'
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// jwt authentication
app.use('/v1', passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

app.use('/svg', express.static(path.join(__dirname, '../svg')));
app.use(
  express.static(path.join(__dirname, '../../client/build'), {
    index: false,
  })
);
app.get('/home.html', function (req, res) {
  res.sendFile(path.join(__dirname, '../../client/build', 'landing-page.html'));
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, '../../client/build', '404.html'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
