const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,

  wishlist: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Place' }
  ]
});

module.exports = mongoose.model("User", UserSchema);