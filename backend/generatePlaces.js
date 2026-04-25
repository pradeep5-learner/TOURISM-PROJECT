require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('./models/place');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB...");

    const prompt = `
Give me 50 tourist places in Delhi.

Conditions:
- Cover all districts
- Include famous and non-famous places
- Avoid duplicates
- Use real latitude and longitude
- Mark only top places as "isFamous" (3 to 5 places is enough): true

Format strictly as JSON array:
[
  {
    "name": "",
    "state": "Delhi",
    "district": "",
    "category": "",
    "description": "",
    "lat": number,
    "lng": number,
    "image": "https://source.unsplash.com/400x300/?place",
    "bestTime": "",
    "crowd": "",
    "duration": "",
    "isFamous": true or false
  }
]

Return ONLY JSON. No explanation.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean response
    const cleanText = text.replace(/```json|```/g, "").trim();

const jsonStart = cleanText.indexOf("[");
const jsonEnd = cleanText.lastIndexOf("]") + 1;

const jsonString = cleanText.substring(jsonStart, jsonEnd);

const json = JSON.parse(jsonString);

    await Place.insertMany(json);

    console.log("✅ 100 places added!");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });