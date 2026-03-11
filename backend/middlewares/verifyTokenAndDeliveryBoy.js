const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../models/DeliveryBoy");

const verifyTokenAndDeliveryBoy = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ⭐ IMPORTANT FIX
    const deliveryBoy = await DeliveryBoy
      .findOne({ user: decoded.id })
      .populate("user", "name email phone profileImage");

    if (!deliveryBoy) {
      return res.status(404).json({
        message: "Delivery boy profile not found"
      });
    }

    if (deliveryBoy.status !== "approved") {
      return res.status(403).json({
        message: "Delivery boy not approved yet"
      });
    }

    req.deliveryBoy = deliveryBoy;

    next();

  } catch (error) {

    console.error("Delivery auth error:", error);

    res.status(401).json({
      message: "Invalid token"
    });

  }
};

module.exports = verifyTokenAndDeliveryBoy;