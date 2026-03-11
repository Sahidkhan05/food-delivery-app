const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },

    cuisineType: {
      type: [String],
      default: [],
    },

    image: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    openingTime: String,

    closingTime: String,

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    /* ⭐ ADD THIS LOCATION FIELD */

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
  },
  { timestamps: true }
);

/* ⭐ GEO INDEX */

restaurantSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("Restaurant", restaurantSchema);