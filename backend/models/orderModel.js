const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    }
  ],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

   deliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  
  totalPrice: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["UPI", "Card", "Cash on Delivery"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "success"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "Out for delivery", "delivered"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
