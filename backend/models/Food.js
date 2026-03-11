const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    halfPrice: {
      type: Number,
      required: true,
    },

    fullPrice: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
    },

    category: {
      type: String,
      required: true,
    },

    prepTime: {
      type: Number,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Food", foodSchema);