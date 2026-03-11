const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

// ================= GET RESTAURANTS =================

const getAllRestaurants = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    const restaurants = await Restaurant.find()
      .populate("owner", "name")
      .skip(skip)
      .limit(limit);

    const totalRestaurants = await Restaurant.countDocuments();

    res.status(200).json({
      success: true,
      restaurants,
      currentPage: page,
      totalPages: Math.ceil(totalRestaurants / limit)
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch restaurants",
      error: error.message
    });
  }
};

// ================= UPDATE PROFILE =================

const updateProfile = async (req, res) => {

  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const { name, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      restaurant: updatedUser
    });

  } catch (err) {

    console.error("Profile update error:", err);

    res.status(500).json({
      message: "Failed to update profile",
      error: err.message
    });

  }

};

// ================= UPDATE LOCATION =================

const updateLocation = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude & Longitude required"
      });
    }

    const restaurant = await Restaurant.findOne({ owner: userId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurant.currentLocation = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    await restaurant.save();

    res.status(200).json({
      message: "Restaurant location updated",
      restaurant
    });

  } catch (err) {

    console.error("Location update error:", err);

    res.status(500).json({
      message: "Failed to update location",
      error: err.message
    });

  }
};


const getRestaurantProfile = async (req, res) => {

  try {

    const userId = req.user.id;

    const restaurant = await Restaurant
      .findOne({ owner: userId })
      .populate("owner", "name email phone");

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    res.status(200).json({
      restaurant
    });

  } catch (error) {

    console.error("Profile fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch profile"
    });

  }

};

module.exports = {
  getAllRestaurants,
  updateProfile,
  updateLocation,
  getRestaurantProfile,
};