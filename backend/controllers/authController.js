const User = require('../models/User');
const DeliveryBoy = require('../models/DeliveryBoy');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Create JWT Token
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // ✅ user ID + role
    process.env.JWT_SECRET,
    { expiresIn: '3d' }
  );
};

// USER SIGNUP
const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body; // ✅ Include phone here

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: 'user',
      phone: phone, // ✅ Save phone in DB
    });

    const token = createToken(user._id);
    res.status(201).json({ token, user });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// DELIVERY BOY SIGNUP
const signupDelivery = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleType } = req.body;

    if (!phone || !vehicleType) {
      return res.status(400).json({ error: "Phone and Vehicle Type required" });
    }

    // Check if email already exists in DeliveryBoy collection
    const exists = await DeliveryBoy.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create new delivery boy
    const deliveryBoy = await DeliveryBoy.create({
      name,
      email,
      password: hash,
      phone,
      vehicleType,
      role: "deliveryBoy", // optional, model me role nahi hai
      status: "pending",
    });

    // Create JWT token
    const token = createToken(deliveryBoy._id);

    res.status(201).json({ token, user: deliveryBoy });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// RESTAURANT SIGNUP (status: pending)
const signupRestaurant = async (req, res) => {
  try {
    const { name, email, password, address, cuisineType } = req.body;

    if (!address || !cuisineType) {
      return res.status(400).json({ error: "Address and Cuisine Type required" });
    }

    // ✅ Check for uploaded image
    if (!req.file) {
      return res.status(400).json({ error: "Restaurant image is required" });
    }

    const image = req.file.filename; // multer stores filename

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      address,
      cuisineType,
      image,               // ✅ Save image name to DB
      role: 'restaurant',
      status: 'pending'
    });

    const token = createToken(user._id);
    res.status(201).json({ token, user });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// COMMON LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;

    // Check DeliveryBoy collection
    user = await DeliveryBoy.findOne({ email });

    // If not found in DeliveryBoy, check User collection
    if (!user) {
      user = await User.findOne({ email });
    }

    // If still not found
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    // Approval check for restaurant or deliveryBoy
    if ((user.role === 'restaurant' || user.role === 'deliveryBoy') && user.status !== 'approved') {
      return res.status(403).json({ error: `Your account is ${user.status}. Please wait for admin approval.` });
    }

    // Create token
    const token = createToken(user);

    // Send response
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isActive: user.isActive || false, // optional: only for deliveryBoy
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADMIN LOGIN
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email });

    if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (admin.role !== 'admin') return res.status(403).json({ message: "Not authorized as admin" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, admin: { name: admin.name, email: admin.email, role: admin.role } });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const userProfileUpdate = async (req, res) => {
  try {
    const userId = req.user.id; // from verifyToken middleware
    const { name, phone, password } = req.body; // ❌ email removed

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Location
const updateLocation = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = req.user.id;  // ✅ FIXED
    const { coordinates } = req.body;

    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({ message: "Coordinates array required [longitude, latitude]" });
    }

    const [longitude, latitude] = coordinates;

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

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Location updated successfully", user: updatedUser });
  } catch (err) {
    console.error("Location update error:", err);
    res.status(500).json({ message: "Failed to update location", error: err.message });
  }
};




module.exports = {
  signupUser,
  signupDelivery,
  signupRestaurant,
  loginUser,
  loginAdmin,
  userProfileUpdate,
  updateLocation,
};
