
const User = require('../models/User');

// Get all restaurants (for homepage)
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().populate("owner", "name");
    res.status(200).json({ success: true, restaurants });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants", error });
  }
};


// Update Profile
const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user._id;
    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ message: "Profile updated successfully", restaurant: updatedUser });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
};

// Update Location
const updateLocation = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user._id;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: "Latitude & Longitude required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        currentLocation: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "Restaurant not found" });

    res.status(200).json({ message: "Location updated successfully", restaurant: updatedUser });
  } catch (err) {
    console.error("Location update error:", err);
    res.status(500).json({ message: "Failed to update location", error: err.message });
  }
};

module.exports = { getAllRestaurants, updateProfile,  updateLocation };
