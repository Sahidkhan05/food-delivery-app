const DeliveryRequest = require("../models/DeliveryRequest");
const DeliveryBoy = require("../models/DeliveryBoy");
const Order = require("../models/orderModel");

/* ================= GET PROFILE ================= */

const getDeliveryBoyDetails = async (req, res) => {
  try {

    const deliveryBoy = await DeliveryBoy
      .findById(req.deliveryBoy._id)
      .populate("user", "name email phone profileImage");

    if (!deliveryBoy) {
      return res.status(404).json({
        message: "Delivery boy not found"
      });
    }

    res.status(200).json(deliveryBoy);

  } catch (error) {

    console.error("Fetch delivery profile error:", error);

    res.status(500).json({
      message: "Server error"
    });

  }
};

/* ================= UPDATE PROFILE ================= */

const updateDeliveryBoyProfile = async (req, res) => {
  try {

    const deliveryBoyId = req.deliveryBoy._id;

    const { name, phone, vehicleType, vehicleNumber, isActive } = req.body;

    const updatedDeliveryBoy = await DeliveryBoy.findByIdAndUpdate(
      deliveryBoyId,
      {
        vehicleType,
        vehicleNumber,
        ...(isActive !== undefined && { isActive })
      },
      { new: true, runValidators: true }
    ).populate("user", "name email phone profileImage");

    res.json({
      message: "Profile updated successfully",
      user: updatedDeliveryBoy,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};

/* ================= ACCEPT DELIVERY ================= */

const acceptDeliveryRequest = async (req, res) => {
  try {

    const deliveryBoyId = req.deliveryBoy._id;
    const { requestId } = req.params;

    const request = await DeliveryRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Delivery request not found"
      });
    }

    if (!request.possibleDeliveryBoys.includes(deliveryBoyId)) {
      return res.status(403).json({
        message: "You are not eligible for this order"
      });
    }

    request.status = "accepted";
    request.acceptedBy = deliveryBoyId;

    await request.save();

    await Order.findByIdAndUpdate(request.order, {
      deliveryBoy: deliveryBoyId,
      orderStatus: "Out for delivery",
    });

    res.status(200).json({
      message: "You accepted the delivery",
      request
    });

  } catch (error) {

    console.error("Accept delivery request error:", error);

    res.status(500).json({
      message: "Something went wrong"
    });

  }
};

/* ================= REJECT DELIVERY ================= */

const rejectDeliveryRequest = async (req, res) => {
  try {

    const deliveryBoyId = req.deliveryBoy._id;
    const { requestId } = req.params;

    const request = await DeliveryRequest.findByIdAndUpdate(
      requestId,
      { $pull: { possibleDeliveryBoys: deliveryBoyId } },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({
        message: "Delivery request not found"
      });
    }

    if (request.possibleDeliveryBoys.length === 0) {
      request.status = "failed";
      await request.save();
    }

    res.status(200).json({
      message: "You rejected the delivery"
    });

  } catch (error) {

    console.error("Reject delivery request error:", error);

    res.status(500).json({
      message: "Something went wrong"
    });

  }
};

/* ================= DELIVERY ORDERS ================= */

const getDeliveryOrders = async (req, res) => {
  try {

    const deliveryBoyId = req.deliveryBoy._id;

    const pendingRequests = await DeliveryRequest.find({
      possibleDeliveryBoys: deliveryBoyId,
      status: "pending",
    }).populate({
      path: "order",
      populate: [
        { path: "restaurant", select: "restaurantName address" },
        { path: "items.food", select: "name price image" },
      ],
    });

    const assignedOrders = await DeliveryRequest.find({
      acceptedBy: deliveryBoyId,
      status: "accepted",
    })
      .populate({
        path: "order",
        populate: [
          { path: "restaurant", select: "restaurantName address" },
          { path: "user", select: "name phone" },
          { path: "items.food", select: "name price image" },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({
      pendingRequests,
      assignedOrders
    });

  } catch (error) {

    console.error("Get delivery orders error:", error);

    res.status(500).json({
      message: "Something went wrong"
    });

  }
};

/* ================= UPDATE LOCATION ================= */

const updateLocation = async (req, res) => {
  try {

    const deliveryBoyId = req.deliveryBoy._id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude & Longitude required"
      });
    }

    const updatedBoy = await DeliveryBoy.findByIdAndUpdate(
      deliveryBoyId,
      {
        $set: {
          currentLocation: {
            type: "Point",
            coordinates: [longitude, latitude],
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

    res.status(500).json({
      message: "Failed to update location"
    });

  }
};

/* ================= MARK DELIVERED ================= */

const markOrderDelivered = async (req, res) => {
  try {

    const deliveryBoyId = req.deliveryBoy._id;
    const { requestId } = req.params;

    const request = await DeliveryRequest
      .findById(requestId)
      .populate("order");

    if (!request) {
      return res.status(404).json({
        message: "Delivery request not found"
      });
    }

    if (request.acceptedBy.toString() !== deliveryBoyId.toString()) {
      return res.status(403).json({
        message: "You are not allowed to deliver this order"
      });
    }

    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Order not in accepted state"
      });
    }

    request.status = "completed";
    await request.save();

    request.order.orderStatus = "delivered";
    await request.order.save();

    await DeliveryBoy.findByIdAndUpdate(deliveryBoyId, {
      $inc: {
        totalEarnings: Number(request.order.totalPrice),
        totalDeliveries: 1,
      },
    });

    res.status(200).json({
      message: "Order marked as delivered",
      request
    });

  } catch (error) {

    console.error("Mark delivered error:", error);

    res.status(500).json({
      message: "Something went wrong"
    });

  }
};

/* ================= DELIVERED ORDERS ================= */

const getDeliveredOrders = async (req, res) => {
  try {

    const deliveryBoyId = req.deliveryBoy._id;

    const deliveredRequests = await DeliveryRequest.find({
      acceptedBy: deliveryBoyId,
      status: "completed",
    })
      .populate({
        path: "order",
        populate: [
          { path: "restaurant", select: "restaurantName address" },
          { path: "user", select: "name phone" },
          { path: "items.food", select: "name price image" },
        ],
      })
      .sort({ updatedAt: -1 });

    res.status(200).json(deliveredRequests);

  } catch (error) {

    console.error("Fetch delivered orders error:", error);

    res.status(500).json({
      message: "Something went wrong"
    });

  }
};

/* ================= EARNINGS ================= */

const getEarnings = async (req, res) => {
  try {

    const deliveryBoy = await DeliveryBoy
      .findById(req.deliveryBoy._id)
      .populate("user", "name");

    if (!deliveryBoy) {
      return res.status(404).json({
        message: "Delivery boy not found"
      });
    }

    res.status(200).json({
      totalEarnings: deliveryBoy.totalEarnings,
      totalDeliveries: deliveryBoy.totalDeliveries,
    });

  } catch (error) {

    console.error("Fetch earnings error:", error);

    res.status(500).json({
      message: "Something went wrong"
    });

  }
};

const getPendingDeliveryRequests = async (req, res) => {
  try {

    const deliveryBoyId = req.deliveryBoy._id;

    const requests = await DeliveryRequest.find({
      status: "pending",
      possibleDeliveryBoys: deliveryBoyId,
    })
    .populate({
      path: "order",
      populate: [
        { path: "restaurant", select: "restaurantName currentLocation" },
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

module.exports = {
  updateLocation,
  getDeliveryBoyDetails,
  updateDeliveryBoyProfile,
  acceptDeliveryRequest,
  rejectDeliveryRequest,
  getDeliveryOrders,
  markOrderDelivered,
  getDeliveredOrders,
  getEarnings,
  getPendingDeliveryRequests,
};