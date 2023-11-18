const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

/* middleware */
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/api/establishments', require('./routes/establishmentRoutes'));

app.get('/', (_req, res) => {
  res.status(200).send({ message: 'ok' });
});

app.listen(port, (err) => {
  if (err) console.log({ error: err });
  console.log(`🚀 Express running on ${port}`);
});
