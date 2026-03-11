const express = require("express");
const router = express.Router();

const {
  signupUser,
  signupDelivery,
  signupRestaurant,
  loginUser,
  loginAdmin,
  userProfileUpdate,
  updateLocation,
  forgotPassword,
  resetPassword,
  addAddress,
  getUserProfile,
  updateProfileImage,
} = require("../controllers/authController");

const upload = require("../middlewares/uploadMiddleware");
const verifyToken = require("../middlewares/authMiddleware");

// User
router.post("/signup/user", signupUser);

// Delivery Boy (with profile image)
router.post(
  "/signup/delivery",
  upload.single("image"),
  signupDelivery
);

// Restaurant
router.post(
  "/signup/restaurant",
  upload.single("image"),
  signupRestaurant
);

// Login
router.post("/login", loginUser);

// Admin Login
router.post("/admin/login", loginAdmin);

// Profile update
router.put("/profile", verifyToken, userProfileUpdate);

// Location update
router.put("/location", verifyToken, updateLocation);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

// Add address
router.post("/address", verifyToken, addAddress);

// Get profile
router.get("/profile", verifyToken, getUserProfile);

// Update profile image
router.put(
  "/profile-image",
  verifyToken,
  upload.single("image"),
  updateProfileImage
);

module.exports = router;