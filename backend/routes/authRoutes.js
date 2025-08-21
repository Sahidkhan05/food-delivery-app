const express = require('express');
const router = express.Router();
const {
  signupUser,
  signupDelivery,
  signupRestaurant,
  loginUser,
  loginAdmin,
  userProfileUpdate,
} = require('../controllers/authController');
const upload = require('../middlewares/uploadMiddleware');

const verifyToken = require('../middlewares/authMiddleware');

// User
router.post('/signup/user', signupUser);

// Delivery Boy
router.post('/signup/delivery', signupDelivery);

// Restaurant
router.post('/signup/restaurant', upload.single('image') ,signupRestaurant);

// Login (Common)
router.post('/login', loginUser);

// Login (Cadmin)
router.post('/admin/login', loginAdmin);


router.put('/profile', verifyToken, userProfileUpdate);

module.exports = router;
