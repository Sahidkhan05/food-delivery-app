const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["user", "restaurant"], // deliveryBoy hata diya
    default: "user",
  },

  // Restaurant-specific fields
  restaurantName: {
    type: String,
  },

  address: {
    type: String,
  },

  cuisineType: {
    type: String,
  },

  image: {
    type: String,
    default: "",
  },

  currentLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  joiningDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

userSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
