const mongoose = require("mongoose");

const deliveryRequestSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // restaurant user
    required: true
  },
  possibleDeliveryBoys: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User" // delivery boy users
    }
  ],
  status: {
    type: String,
    enum: ["pending", "accepted", "expired", "cancelled", "failed", "completed" , "delivered"], 
    default: "pending"
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // delivery boy who accepted
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("DeliveryRequest", deliveryRequestSchema);
