const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Enable req.body
app.use(express.json());

/* Enable CORS (with additional config options required for cookies) */
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// HTTP Headers
app.use(helmet());

app.use('/api/establishments', require('./routes/establishments'));
app.use('/api/users', require('./routes/users'));
app.use('/api/inspections', require('./routes/inspections'));
app.use('/api/comments', require('./routes/comments'));

app.get('/', (_req, res) => {
  res.status(200).send({ message: 'ok' });
});

app.listen(port, (err) => {
  if (err) console.log({ error: err });
  console.log(`🚀 Express running on ${port}`);
});
