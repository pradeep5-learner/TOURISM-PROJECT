require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/place');

const places = require('./places.json');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🌱 Connected to MongoDB...");

    await Place.deleteMany(); // optional
    await Place.insertMany(places);

    console.log("✅ Places inserted!");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });