const mongoose = require("mongoose");

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  vehicleType: { type: String },
  vehicleNumber: { type: String },
  isActive: { type: Boolean, default: false },
  totalDeliveries: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  joiningDate: { type: Date, default: Date.now },
  currentLocation: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] },
  },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
   role: { type: String, default: "deliveryBoy" },
}, { timestamps: true });

deliveryBoySchema.index({ currentLocation: "2dsphere" });

module.exports = mongoose.model("DeliveryBoy", deliveryBoySchema);
