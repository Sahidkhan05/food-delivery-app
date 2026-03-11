const User = require("../models/User");
const DeliveryBoy = require("../models/DeliveryBoy");
const Restaurant = require("../models/Restaurant");

// ================= RESTAURANTS =================

// Get pending restaurants
const getPendingRestaurants = async (req, res) => {
  try {

    const restaurants = await User.find({
      role: "restaurant",
      status: "pending",
    }).select("-password");

    res.json(restaurants);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Approve restaurant
const approveRestaurant = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Restaurant not found" });

    if (user.role !== "restaurant")
      return res.status(400).json({ message: "User is not restaurant" });

    user.status = "approved";
    await user.save();

    const existingRestaurant = await Restaurant.findOne({ owner: user._id });

    if (!existingRestaurant) {

      await Restaurant.create({
        restaurantName: user.name,
        owner: user._id,
        image: user.profileImage,
        cuisineType: user.cuisineType || [],
        address: {
          street: user.addresses?.[0]?.street || "",
          city: user.addresses?.[0]?.city || "",
          state: user.addresses?.[0]?.state || "",
          pincode: user.addresses?.[0]?.pincode || ""
        },
        status: "approved"
      });

    }

    res.json({ message: "Restaurant approved successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Reject restaurant
const rejectRestaurant = async (req, res) => {
  try {

    const restaurant = await User.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    res.json({ message: "Restaurant rejected successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get approved restaurants
const getApprovedRestaurants = async (req, res) => {
  try {

    const restaurants = await User.find({
      role: "restaurant",
      status: "approved",
    }).select("-password");

    res.json(restaurants);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Delete restaurant
const deleteRestaurant = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Restaurant not found" });

    await Restaurant.deleteOne({ owner: user._id });

    await User.findByIdAndDelete(user._id);

    res.json({ message: "Restaurant deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ================= DELIVERY BOYS =================

// Get pending delivery boys
const getPendingDeliveryBoys = async (req, res) => {
  try {

    const deliveryBoys = await User.find({
      role: "deliveryBoy",
      status: "pending",
    }).select("-password");

    res.json(deliveryBoys);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Approve delivery boy
const approveDeliveryBoy = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    if (user.role !== "deliveryBoy") {
      return res.status(400).json({ message: "User is not a delivery boy" });
    }

    user.status = "approved";
    await user.save();

    const existing = await DeliveryBoy.findOne({ user: user._id });

    if (!existing) {

      await DeliveryBoy.create({
        user: user._id,
        email: user.email,     // ⭐ IMPORTANT
        phone: user.phone,
        vehicleType: user.vehicleType,
        vehicleNumber: user.vehicleNumber,
        status: "approved"
      });

    }

    res.json({ message: "Delivery boy approved successfully" });

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: err.message });

  }
};

// Reject delivery boy
const rejectDeliveryBoy = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!user)
      return res.status(404).json({ message: "Delivery boy not found" });

    res.json({ message: "Delivery boy rejected successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// Delete delivery boy
const deleteDeliveryBoy = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "Delivery boy not found" });

    await DeliveryBoy.deleteOne({ user: user._id });

    await User.findByIdAndDelete(user._id);

    res.json({ message: "Delivery boy deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ================= USERS =================

const getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};


const getAllRestaurants = async (req, res) => {
  try {

    const { search, status, page = 1, limit = 5 } = req.query;

    let query = { role: "restaurant" };

    // STATUS FILTER
    if (status) {
      query.status = status;
    }

    // SEARCH
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { cuisineType: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const restaurants = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      restaurants,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalRestaurants: total
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getApprovedDeliveryBoys = async (req, res) => {
  try {

    const { page = 1, limit = 5, search } = req.query;

    let query = {
      role: "deliveryBoy",
      status: "approved"
    };

    // SEARCH (name / email / phone)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const deliveryBoys = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      deliveryBoys,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalDeliveryBoys: total
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingRestaurants,
  approveRestaurant,
  rejectRestaurant,
  getApprovedRestaurants,
  deleteRestaurant,

  getPendingDeliveryBoys,
  approveDeliveryBoy,
  rejectDeliveryBoy,
  getApprovedDeliveryBoys,
  deleteDeliveryBoy,

  getAllUsers,
  getAllRestaurants,
  deleteUser,
};