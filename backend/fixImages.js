require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/place');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const places = await Place.find();

    for (let p of places) {

      // 🔥 Fix bad or missing images
      if (!p.image || p.image.includes("unsplash") || p.image.includes("source")) {
        p.image = `https://images.unsplash.com/photo-1507525428034-b723cf961d3e`;
        console.log("Updated image for:", p.name);
        await p.save();
      }
    }

    console.log("✅ All images fixed");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });