const express = require("express");
const router = express.Router();
const {
  getPendingRestaurants,
  approveRestaurant,
  rejectRestaurant,
  getApprovedRestaurants,
  getPendingDeliveryBoys,
  approveDeliveryBoy,
  rejectDeliveryBoy,
  getApprovedDeliveryBoys,
  getAllUsers
} = require("../controllers/adminController");

const requireAuth = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminOnly')


router.get("/pending-restaurants", getPendingRestaurants);
router.put("/approve/:id", requireAuth, requireAdmin, approveRestaurant);
router.put("/reject/:id", requireAuth, requireAdmin, rejectRestaurant);
router.get("/approved-restaurants", getApprovedRestaurants);

router.get('/delivery-boy/requests', getPendingDeliveryBoys);
router.patch('/delivery-boy/:id/approve',requireAuth, requireAdmin, approveDeliveryBoy);
router.patch('/delivery-boy/:id/reject', requireAuth, requireAdmin, rejectDeliveryBoy);
router.get('/delivery-boy/approved', getApprovedDeliveryBoys);

router.get('/users', requireAuth, requireAdmin, getAllUsers);

module.exports = router;
