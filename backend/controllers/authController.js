const User = require("../models/User");
const DeliveryBoy = require("../models/DeliveryBoy");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendWelcomeEmail, sendEmail } = require("../services/emailService");
const crypto = require("crypto");
require("dotenv").config();

// CREATE JWT TOKEN
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "3d" }
  );
};

// ================= USER SIGNUP =================

const signupUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });

    if (exists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      phone,
      role: "user",
    });

    await sendWelcomeEmail(user.email, user.role);

    const token = createToken(user);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELIVERY BOY SIGNUP =================

const signupDelivery = async (req, res) => {
  try {

    const { name, email, password, phone, vehicleType, vehicleNumber } = req.body;

    if (!name || !email || !password || !phone || !vehicleType || !vehicleNumber) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);

    const profileImage = req.file ? req.file.filename : "";

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      phone,
      profileImage,
      role: "deliveryBoy",
      status: "pending",

      // temporarily store vehicle info
      vehicleType,
      vehicleNumber
    });

    const token = createToken(user);

    res.status(201).json({
      token,
      user
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({ error: err.message });

  }
};

// ================= RESTAURANT SIGNUP =================

const signupRestaurant = async (req, res) => {
  try {

    console.log("========= RESTAURANT SIGNUP =========");

    // 🔎 check body
    console.log("REQ BODY:", req.body);

    // 🔎 check uploaded image
    console.log("REQ FILE:", req.file);

    const { name, email, password, phone, address, cuisineType } = req.body;

    // validation
    if (!name || !email || !password || !phone || !address || !cuisineType) {
      return res.status(400).json({ error: "All fields required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Restaurant image required" });
    }

    // check email exists
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // hash password
    const hash = await bcrypt.hash(password, 10);

    // prepare cuisine array
    const cuisineArray =
      cuisineType && cuisineType.trim() !== ""
        ? cuisineType.split(",").map((c) => c.trim())
        : [];

    console.log("CUISINE ARRAY:", cuisineArray);

    // create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hash,
      phone,

      cuisineType: cuisineArray,

      addresses: [
        {
          type: "Work",
          street: address,
        },
      ],

      role: "restaurant",
      status: "pending",

      profileImage: req.file.filename,
    });

    console.log("USER SAVED:", user);

    await sendWelcomeEmail(user.email, user.role);

    const token = createToken(user);

    res.status(201).json({
      message: "Restaurant signup successful",
      token,
      user,
    });

  } catch (err) {

    console.log("SIGNUP ERROR:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

// ================= LOGIN =================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user =
      (await User.findOne({ email })) ||
      (await DeliveryBoy.findOne({ email }));

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (
      (user.role === "restaurant" || user.role === "deliveryBoy") &&
      user.status !== "approved"
    ) {
      return res
        .status(403)
        .json({ error: `Account is ${user.status}. Wait for admin approval.` });
    }

    const token = createToken(user);

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        profileImage: user.profileImage || "",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET PROFILE =================

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= UPDATE PROFILE =================

const userProfileUpdate = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    );

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= UPDATE LOCATION =================

const updateLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        currentLocation: {
          type: "Point",
          coordinates,
        },
      },
      { new: true }
    );

    res.json({ message: "Location updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= FORGOT PASSWORD =================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail(
      user.email,
      "Reset Password",
      `Click here to reset your password: ${resetLink}`
    );

    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ================= RESET PASSWORD =================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(admin);

    res.json({ token, admin });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addAddress = async (req, res) => {
  try {
    res.json({ message: "Address added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    res.json({ message: "Profile image updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  forgotPassword,
  resetPassword,
  getUserProfile,
  addAddress,
  updateProfileImage,
  
};