const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
 
  cuisineType: [String], // like ["Indian", "Chinese"]
  image: {
    type: String, // We will store filename (e.g. "17218917123-myfile.png")
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
