const DeliveryRequest = require("../models/DeliveryRequest");
const DeliveryBoy = require("../models/DeliveryBoy");
const Order = require("../models/orderModel");

// Get delivery boy profile
const getDeliveryBoyDetails = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId).select("-password");

    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    res.json(deliveryBoy);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update delivery boy profile
const updateDeliveryBoyProfile = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { name, phone, vehicleType, vehicleNumber, isActive } = req.body;

    const updatedDeliveryBoy = await DeliveryBoy.findByIdAndUpdate(
      deliveryBoyId,
      { name, phone, vehicleType, vehicleNumber, ...(isActive !== undefined && { isActive }) },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedDeliveryBoy || updatedDeliveryBoy.role !== "deliveryBoy") {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedDeliveryBoy,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Accept delivery request
const acceptDeliveryRequest = async (req, res) => {
  try {
   const deliveryBoyId = req.user._id;
    const { requestId } = req.params;

    const request = await DeliveryRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Delivery request not found" });
    }

    if (!request.possibleDeliveryBoys.includes(deliveryBoyId)) {
      return res.status(403).json({ message: "You are not eligible for this order" });
    }

    if (request.status === "accepted" && request.acceptedBy.toString() !== deliveryBoyId) {
      return res.status(400).json({ message: "Another delivery boy has already accepted this order" });
    }

    request.status = "accepted";
    request.acceptedBy = deliveryBoyId;
    await request.save();

    await Order.findByIdAndUpdate(request.order, {
      deliveryBoy: deliveryBoyId,
      orderStatus: "Out for delivery", // ✅ enum value
    });

    res.status(200).json({ message: "You accepted the delivery", request });
  } catch (error) {
    console.error("Accept delivery request error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Reject delivery request
const rejectDeliveryRequest = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { requestId } = req.params;

    const request = await DeliveryRequest.findByIdAndUpdate(
      requestId,
      { $pull: { possibleDeliveryBoys: deliveryBoyId } },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ message: "Delivery request not found" });
    }

    if (request.possibleDeliveryBoys.length === 0) {
      request.status = "failed";
      await request.save();
    }

    res.status(200).json({ message: "You rejected the delivery" });
  } catch (error) {
    console.error("Reject delivery request error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get pending delivery requests
const getPendingDeliveryRequests = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;

    const requests = await DeliveryRequest.find({
      status: "pending",
      possibleDeliveryBoys: deliveryBoyId,
    })
      .populate({
        path: "order",
        populate: [
          { path: "restaurant", select: "name currentLocation" },
          { path: "user", select: "name phone" },
          { path: "items.food", select: "name price image" },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    console.error("Fetch delivery requests error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get delivery orders
const getDeliveryOrders = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;

    const pendingRequests = await DeliveryRequest.find({
      possibleDeliveryBoys: deliveryBoyId,
      status: "pending",
    })
      .populate("order")
      .populate({
        path: "order",
        populate: [
          { path: "restaurant", select: "name" },
          { path: "items.food", select: "name price image" },
        ],
      });

    const assignedOrders = await Order.find({
      deliveryBoy: deliveryBoyId,
      orderStatus: "Out for delivery", // ✅ enum value
    })
      .populate("restaurant", "name")
      .populate("items.food", "name price image");

    res.json({ pendingRequests, assignedOrders });
  } catch (error) {
    console.error("Get delivery orders error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Update delivery boy location
const updateLocation = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude & Longitude required" });
    }

    const updatedBoy = await DeliveryBoy.findByIdAndUpdate(
      deliveryBoyId,
      {
        $set: {
          currentLocation: {
            type: "Point",
            coordinates: [longitude, latitude], // longitude first
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Location updated successfully",
      deliveryBoy: updatedBoy,
    });
  } catch (err) {
    console.error("Update location error:", err);
    res.status(500).json({ message: "Failed to update location" });
  }
};

// Mark order as delivered
const markOrderDelivered = async (req, res) => {
  try {
    const deliveryBoyId = req.user._id;
    const { requestId } = req.params;

    const request = await DeliveryRequest.findById(requestId).populate("order");

    if (!request) {
      return res.status(404).json({ message: "Delivery request not found" });
    }

    if (request.acceptedBy.toString() !== deliveryBoyId.toString()) {
      return res.status(403).json({ message: "You are not allowed to deliver this order" });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({ message: "Order not in accepted state" });
    }

    // update request
    request.status = "delivered";
    await request.save();

    // update order
    request.order.orderStatus = "Delivered";
    await request.order.save();

    res.status(200).json({ message: "Order marked as delivered", request });
  } catch (error) {
    console.error("Mark delivered error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  updateLocation,
  getDeliveryBoyDetails,
  updateDeliveryBoyProfile,
  acceptDeliveryRequest,
  rejectDeliveryRequest,
  getPendingDeliveryRequests,
  getDeliveryOrders,
  markOrderDelivered,
};
