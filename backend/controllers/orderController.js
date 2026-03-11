const Order = require("../models/orderModel");
const Food = require("../models/Food");
const DeliveryRequest = require("../models/DeliveryRequest");
const DeliveryBoy = require("../models/DeliveryBoy");
const Restaurant = require("../models/Restaurant");

/* ================= PLACE ORDER ================= */

const placeOrder = async (req, res) => {
  try {

    const userId = req.user.id;
    const { items, totalPrice, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    const foodItem = await Food.findById(items[0].food);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const restaurant = await Restaurant.findOne({
      owner: foodItem.restaurant
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const order = await Order.create({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      restaurant: restaurant._id,
      orderStatus: "pending",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Something went wrong while placing the order",
    });

  }
};


/* ================= USER ORDERS ================= */

const getUserOrders = async (req, res) => {
  try {

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("user", "name email phone addresses")
      .populate("restaurant", "restaurantName address")
      .populate("items.food", "name price image");

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch orders",
    });

  }
};


/* ================= RESTAURANT ORDERS ================= */

const getOrdersForRestaurant = async (req, res) => {
  try {

    const restaurant = await Restaurant.findOne({
      owner: req.user.id
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    const orders = await Order.find({
      restaurant: restaurant._id
    })
      .sort({ createdAt: -1 })
      .populate("user", "name email phone addresses")
      .populate("deliveryBoy", "name phone")
      .populate("items.food", "name price image");

    res.status(200).json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch orders",
    });

  }
};


/* ================= UPDATE ORDER STATUS ================= */

const updateOrderStatus = async (req, res) => {

  try {

    const orderId = req.params.orderId;
    const { status } = req.body;

    const userRole = req.user.role;
    const userId = req.user.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    /* ================= CANCEL ORDER ================= */

    if (status === "cancelled") {

      if (order.orderStatus === "delivered") {
        return res.status(400).json({
          message: "Delivered order cannot be cancelled"
        });
      }

      order.orderStatus = "cancelled";
      order.cancelledBy = userRole;
      order.cancelledAt = new Date();

      await order.save();

      return res.status(200).json({
        message: "Order cancelled successfully",
        order
      });
    }

    /* ================= RESTAURANT ACCEPT ================= */

    if (userRole === "restaurant" && status === "accepted") {

      const restaurant = await Restaurant.findById(order.restaurant);

      if (restaurant.owner.toString() !== userId.toString()) {
        return res.status(403).json({
          message: "You are not authorized for this order",
        });
      }

      order.orderStatus = "accepted";
      await order.save();

      const nearbyDeliveryBoys = await DeliveryBoy.find({
        status: "approved",
        isActive: true,
        currentLocation: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: restaurant.currentLocation.coordinates,
            },
            $maxDistance: 5000,
          },
        },
      });

      const existingRequest = await DeliveryRequest.findOne({
        order: order._id,
      });

      if (!existingRequest && nearbyDeliveryBoys.length > 0) {

        await DeliveryRequest.create({
          order: order._id,
          restaurant: order.restaurant,
          possibleDeliveryBoys: nearbyDeliveryBoys.map((boy) => boy._id),
          status: "pending",
          acceptedBy: null,
        });

      }

    }

    /* ================= DELIVERY BOY UPDATE ================= */

    if (
      userRole === "deliveryBoy" &&
      (status === "out_for_delivery" || status === "delivered")
    ) {

      const deliveryRequest = await DeliveryRequest.findOne({
        order: order._id,
        acceptedBy: req.deliveryBoy._id,
      });

      if (!deliveryRequest) {
        return res.status(403).json({
          message: "You are not assigned to this order",
        });
      }

      if (status === "out_for_delivery") {

        order.orderStatus = "out_for_delivery";
        await order.save();

      }

      if (status === "delivered") {

        order.orderStatus = "delivered";
        order.deliveredAt = new Date();

        await order.save();

        deliveryRequest.status = "completed";
        await deliveryRequest.save();

        await DeliveryBoy.findByIdAndUpdate(req.deliveryBoy._id, {
          $inc: {
            totalDeliveries: 1,
            totalEarnings: order.totalPrice,
          },
        });

      }

    }

    res.status(200).json({
      message: "Order status updated",
      order,
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Something went wrong",
    });

  }

};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrdersForRestaurant,
  updateOrderStatus,
};