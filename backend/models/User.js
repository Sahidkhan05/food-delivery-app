const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Home", "Work", "Other"],
    default: "Home",
  },
  street: String,
  city: String,
  state: String,
  pincode: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/,
    },

    role: {
      type: String,
      enum: ["user", "restaurant", "deliveryBoy", "admin"],
      default: "user",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // 🔹 restaurant only
    cuisineType: {
      type: [String],
    },

    // 🔹 delivery boy only
    vehicleType: {
      type: String,
    },

    vehicleNumber: {
      type: String,
    },

    addresses: {
      type: [addressSchema],
      default: [],
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

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("User", userSchema);