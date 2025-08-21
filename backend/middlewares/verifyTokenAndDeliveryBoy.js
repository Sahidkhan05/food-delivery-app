const jwt = require("jsonwebtoken");
const DeliveryBoy = require("../models/DeliveryBoy");

const verifyTokenAndDeliveryBoy = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token ID:", decoded.id);

    const user = await DeliveryBoy.findById(decoded.id);
    if (!user) {
      console.log("User not found");
      return res.status(403).json({ message: "User not found" });
    }

    console.log("User role:", user.role);
    console.log("User status:", user.status);

    if (!user || user.role !== "deliveryBoy" || user.status !== "approved") {
      console.log("User not authorized: role or status mismatch");
      return res.status(403).json({ message: "Only approved delivery boys can access this" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in token verification:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyTokenAndDeliveryBoy;
