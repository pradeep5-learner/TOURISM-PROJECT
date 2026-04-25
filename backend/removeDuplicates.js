require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/place');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {

    const places = await Place.find();

    const seen = new Set();

    for (let p of places) {
      const key = p.name + "_" + p.district;

      if (seen.has(key)) {
        await Place.findByIdAndDelete(p._id);
        console.log("Deleted:", p.name);
      } else {
        seen.add(key);
      }
    }

    console.log("✅ Duplicates removed");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });