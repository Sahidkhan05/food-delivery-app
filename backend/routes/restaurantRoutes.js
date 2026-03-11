const express = require("express");
const router = express.Router();

const {
  getAllRestaurants,
  updateProfile,
  updateLocation,
  getRestaurantProfile,
} = require("../controllers/restaurantController");

const verifyTokenAndRestaurant = require("../middlewares/verifyTokenAndRestaurant");

// ================= PUBLIC =================

// Get restaurants with pagination
router.get("/", getAllRestaurants);

// ================= RESTAURANT =================

// Update restaurant profile
router.put("/profile", verifyTokenAndRestaurant, updateProfile);

// Update restaurant location
router.put("/location", verifyTokenAndRestaurant, updateLocation);

router.get("/profile", verifyTokenAndRestaurant, getRestaurantProfile);

module.exports = router;