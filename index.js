require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const cors = require('cors');
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

// import de mes routes
const userRoutes = require('./routes/user.routes');
const offerRoutes = require('./routes/offer.routes');

// utilisation de mes routes
// app.use(userRoutes);
// app.use(offerRoutes);

app.use(userRoutes, offerRoutes);

app.all('*', (req, res) => {
  res.status(404).send('Page not fond');
});

app.listen(process.env.PORT, () => {
  console.log('Server started');
});
