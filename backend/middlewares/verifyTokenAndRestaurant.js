const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyTokenAndRestaurant = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || user.role !== "restaurant" || user.status !== "approved") {
      return res.status(403).json({ message: "Only restaurants can add food" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyTokenAndRestaurant;
