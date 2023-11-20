const jwt = require('jsonwebtoken');

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
