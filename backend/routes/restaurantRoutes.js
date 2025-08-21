const express = require('express');
const router = express.Router();
const { getAllRestaurants ,updateProfile, updateLocation } = require('../controllers/restaurantController');
const verifyTokenAndRestaurant = require("../middlewares/verifyTokenAndRestaurant");

// Public route to fetch all restaurants
router.get('/all', getAllRestaurants);

router.put("/profile", verifyTokenAndRestaurant, updateProfile);

router.put("/location", verifyTokenAndRestaurant, updateLocation);


module.exports = router;

