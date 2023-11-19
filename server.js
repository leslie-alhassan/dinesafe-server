const express = require('express');
const expressSession = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Enable req.body
app.use(express.json());

/* Enable CORS (with additional config options required for cookies) */
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// HTTP Headers
app.use(helmet());

// Include express-session middleware (with additional config options required for Passport session)
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// =========== Passport Config ============

// Initialize Passport middleware
app.use(passport.initialize());

// Passport.session middleware alters the `req` object with the `user` value
// by converting session id from the client cookie into a deserialized user object.
// This middleware also requires `serializeUser` and `deserializeUser` functions written below
// Additional information: https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do
app.use(passport.session());

// =========================================

app.use('/api/establishments', require('./routes/establishments'));
app.use('/api/users', require('./routes/users'));

app.get('/', (_req, res) => {
  res.status(200).send({ message: 'ok' });
});

app.listen(port, (err) => {
  if (err) console.log({ error: err });
  console.log(`🚀 Express running on ${port}`);
});
