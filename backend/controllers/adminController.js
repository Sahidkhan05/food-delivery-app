const User = require("../models/User");
const DeliveryBoy = require("../models/DeliveryBoy");

// Get all pending restaurants
const getPendingRestaurants = async (req, res) => {
  try {
    const pending = await User.find({ role: "restaurant", status: "pending" });
    res.status(200).json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve restaurant
const approveRestaurant = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.status(200).json({ message: "Restaurant approved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject restaurant
const rejectRestaurant = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.status(200).json({ message: "Restaurant rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all approved restaurants
const getApprovedRestaurants = async (req, res) => {
  try {
    const approved = await User.find({ role: "restaurant", status: "approved" });
    res.status(200).json(approved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all pending delivery boys
const getPendingDeliveryBoys = async (req, res) => {
  try {
    const pending = await  DeliveryBoy.find({ role: "deliveryBoy", status: "pending" });
    res.status(200).json(pending);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve delivery boy
const approveDeliveryBoy = async (req, res) => {
  try {
    await  DeliveryBoy.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.status(200).json({ message: "Delivery boy approved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reject delivery boy
const rejectDeliveryBoy = async (req, res) => {
  try {
    await  DeliveryBoy.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.status(200).json({ message: "Delivery boy rejected" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all approved delivery boys
const getApprovedDeliveryBoys = async (req, res) => {
  try {
    const approved = await  DeliveryBoy.find({ role: "deliveryBoy", status: "approved" });
    res.status(200).json(approved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // password hide
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};




module.exports = {
  getPendingRestaurants,
  approveRestaurant,
  rejectRestaurant,
  getApprovedRestaurants, 

  getPendingDeliveryBoys,
  approveDeliveryBoy,
  rejectDeliveryBoy,
  getApprovedDeliveryBoys,

  getAllUsers
};



