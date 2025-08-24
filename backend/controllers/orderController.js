const Order = require("../models/orderModel");
const Food = require("../models/Food");
const DeliveryRequest = require("../models/DeliveryRequest");
const User = require("../models/User");
const DeliveryBoy = require("../models/DeliveryBoy");

// Place a new order
const placeOrder = async (req, res) => {
  try {
    console.log("REQ.USER =>", req.user);
    console.log("REQ.BODY =>", req.body);

    const userId = req.user.id; // from requireAuth middleware
    const { items, totalPrice, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in the order" });
    }

    const firstFoodId = items[0].food;
    const foodItem = await Food.findById(firstFoodId);

    if (!foodItem || !foodItem.restaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant info not found in food item" });
    }

    const restaurantId = foodItem.restaurant;

    const newOrder = new Order({
      user: userId,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      restaurant: restaurantId,
      orderStatus: "pending",
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order placement error:", error);
    res
      .status(500)
      .json({ message: "Something went wrong while placing the order" });
  }
};

// Get all orders for the logged-in user
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId })
  .sort({ createdAt: -1 })
  .populate("user", "name email phone addresses") 
  .populate("restaurant", "name address")        
  .populate("items.food", "name price image");  


    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch user orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getOrdersForRestaurant = async (req, res) => {
  try {
    const restaurantId = req.user.id; // Assuming this is a restaurant login

    const orders = await Order.find({ restaurant: restaurantId })
  .sort({ createdAt: -1 })
  .populate("user", "name email phone addresses")   
  .populate("deliveryBoy", "name phone")          
  .populate("items.food", "name price image");     


    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch restaurant orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders for restaurant" });
  }
};

// orderController.js
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const userRole = req.user.role;
    const userId = req.user.id;

    const order = await Order.findById(orderId)
  .populate("restaurant", "name address")
  .populate("user", "name email phone addresses")
  .populate("deliveryBoy", "name phone")
  .populate("items.food", "name price image");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Restaurant confirms order
    if (userRole === "restaurant" && status === "confirmed") {
      if (order.restaurant._id.toString() !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      order.orderStatus = "confirmed";
      await order.save();

      // Find nearby active delivery boys
const nearbyDeliveryBoys = await DeliveryBoy.find({
  role: "deliveryBoy",
  isActive: true,
  currentLocation: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [75.736243, 26.947729], // Restaurant location
      },
      $maxDistance: 5000, // 5km radius
    },
  },
}).select("name currentLocation phone");

console.log("Nearby boys =>", nearbyDeliveryBoys);


      // Create delivery request if not exists
      const existingRequest = await DeliveryRequest.findOne({
        order: order._id,
      });
      if (!existingRequest) {
        await DeliveryRequest.create({
          order: order._id,
          restaurant: order.restaurant._id,
          possibleDeliveryBoys: nearbyDeliveryBoys.map((boy) => boy._id),
          status: "pending",
          acceptedBy: null,
        });
      }

      console.log(
        "Delivery requests created for",
        nearbyDeliveryBoys.length,
        "boys"
      );

      order.orderStatus = status; // ✅ Restaurant ke liye set karega
      await order.save();
    }

    // Delivery boy updates status
    if (
      userRole === "deliveryBoy" &&
      (status === "Out for delivery" || status === "delivered")
    ) {
      const deliveryRequest = await DeliveryRequest.findOne({
        order: order._id,
        acceptedBy: userId,
      });

      if (!deliveryRequest) {
        return res
          .status(403)
          .json({ message: "You are not assigned to this order" });
      }

      if (status === "Out for delivery") {
        order.orderStatus = "Out for delivery";
        await order.save();
      }

      if (status === "delivered") {
        order.orderStatus = "delivered";
        await order.save();

        deliveryRequest.status = "completed";
        await deliveryRequest.save();
      }
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrdersForRestaurant,
  updateOrderStatus,
};
