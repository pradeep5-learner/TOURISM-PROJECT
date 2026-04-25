require('dotenv').config(); // Line 1: Loads all your secrets
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Place = require('./models/place');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Cloud!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));



// 🔑 Gemini Setup (Using the key name from your .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" }); 

// Temporary in-memory wishlist (We can move this to MongoDB later!)

/* --- API ROUTES --- */

// GET ALL PLACES FROM CLOUD
// GET ALL PLACES FROM CLOUD
app.get("/api/places", async (req, res) => {
  const { state, district, category, famous, search, page = 1, limit = 20 } = req.query;

  // 1. Check if any active filters are being used
  const isFiltering = !!(state || district || category || search);

  try {
    // SCENARIO A: User is filtering (e.g., selected Andhra Pradesh)
    if (isFiltering) {
      let filter = {};
      if (state) filter.state = state;
      if (district) filter.district = district;
      if (category) filter.category = category;
      if (search) filter.name = { $regex: search, $options: "i" };

      const skip = (page - 1) * limit;
      const places = await Place.find(filter)
        .sort({ _id: 1 }) // Keeps pagination stable
        .skip(skip)
        .limit(parseInt(limit));

      return res.json(places);
    }

    // SCENARIO B: Main Page (No filters) -> Show 60 Famous Randomly
    if (famous === "true") {
      const places = await Place.aggregate([
        { $match: { isFamous: true } },
        { $sample: { size: 60 } }
      ]);
      return res.json(places);
    }

    // Default fallback (Empty array or all places)
    return res.json([]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.get("/api/places/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.json(place);
  } catch (err) {
    res.status(500).json({ error: "Error fetching place" });
  }
});

// 🔥 GET ALL PLACES (NO LIMIT, NO PAGINATION)
app.get("/api/allPlaces", async (req, res) => {
  try {
    const places = await Place.find({});
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Error fetching all places" });
  }
});

// ADD A NEW PLACE TO CLOUD
app.post('/api/places', async (req, res) => {
    try {
        const newPlace = new Place(req.body);
        const savedPlace = await newPlace.save();
        res.status(201).json(savedPlace);
    } catch (err) {
        res.status(500).json({ error: "Could not save place" });
    }
});

// WISHLIST ROUTES
app.post("/api/wishlist", async (req, res) => {
  const { placeId, email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({ email });
  }

  if (!user.wishlist.includes(placeId)) {
    user.wishlist.push(placeId);
    await user.save();
  }

  res.json(user.wishlist);
});

app.get("/api/wishlist/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email }).populate("wishlist");

  if (!user) return res.json([]);

  res.json(user.wishlist);
});

app.delete("/api/wishlist/:email/:id", async (req, res) => {
  const { email, id } = req.params;

  const user = await User.findOne({ email });

  if (!user) return res.json([]);

  user.wishlist = user.wishlist.filter(
    p => p.toString() !== id
  );

  await user.save();

  res.json(user.wishlist);
});;



// 🤖 CHATBOT ROUTE
app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();
    res.json({ reply: text });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ reply: "AI is currently offline." });
  }
});

app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));