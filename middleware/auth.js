const jwt = require('jsonwebtoken');
const knex = require('knex')(require('../knexfile'));

// middleware to handle
exports.authorize = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send('Please login');
  }

  // parse bearer token
  const authHeader = req.headers.authorization;
  const authToken = authHeader.slice('Bearer '.length);

  try {
    const payload = jwt.verify(authToken, process.env.JWT_SECRET);
    req.token = payload;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'ACCESS DENIED: Invalid authorization token',
      error: err,
    });
  }
};

// middleware to handle user registration
exports.register = async (req, res, next) => {
  // validate inputs
  if (!req.body.email) {
    return res.status(400).json('Please provide an email address');
  } else if (!req.body.username) {
    return res.status(400).json('Please provide a username');
  } else if (!req.body.password) {
    return res.status(400).json('Please provide a password');
  }

  // verify that user doesn't already exist and that the username is available
  try {
    const user = await knex('users')
      .where({ email: req.body.email })
      .orWhere({ username: req.body.username })
      .first();

    if (user) {
      if (user.email === req.body.email) {
        return res
          .status(400)
          .json('An account with this email already exists');
      } else if (user.username === req.body.username) {
        return res.status(400).json('Sorry, that username is already taken');
      }
    }
    next();
  } catch (err) {
    return res
      .status(500)
      .json(
        `Sorry, we're currently unable to validate the provided information. Please try again later.`
      );
  }
};
