const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyTokenAndRestaurant = async (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User
      .findById(decoded.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (user.role !== "restaurant") {
      return res.status(403).json({
        message: "Access denied: Restaurant only"
      });
    }

    if (user.status !== "approved") {
      return res.status(403).json({
        message: "Restaurant not approved yet"
      });
    }

    req.user = user;

    next();

  } catch (error) {

    console.error("Restaurant auth error:", error);

    res.status(401).json({
      message: "Invalid token"
    });

  }

};

module.exports = verifyTokenAndRestaurant;