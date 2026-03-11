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
  getAllUsers,
  deleteRestaurant,
  deleteDeliveryBoy,
  getAllRestaurants,
  deleteUser,

} = require("../controllers/adminController");

const requireAuth = require("../middlewares/authMiddleware");
const requireAdmin = require("../middlewares/adminOnly");

// ================= RESTAURANTS =================

router.get(
  "/restaurants/pending",
  requireAuth,
  requireAdmin,
  getPendingRestaurants
);

router.patch(
  "/restaurants/:id/approve",
  requireAuth,
  requireAdmin,
  approveRestaurant
);

router.patch(
  "/restaurants/:id/reject",
  requireAuth,
  requireAdmin,
  rejectRestaurant
);

router.get(
  "/restaurants/approved",
  requireAuth,
  requireAdmin,
  getApprovedRestaurants
);

// ✅ DELETE RESTAURANT
router.delete(
  "/restaurants/:id",
  requireAuth,
  requireAdmin,
  deleteRestaurant
);

// ================= DELIVERY BOYS =================

router.get(
  "/delivery-boys/pending",
  requireAuth,
  requireAdmin,
  getPendingDeliveryBoys
);

router.patch(
  "/delivery-boys/:id/approve",
  requireAuth,
  requireAdmin,
  approveDeliveryBoy
);

router.patch(
  "/delivery-boys/:id/reject",
  requireAuth,
  requireAdmin,
  rejectDeliveryBoy
);

router.get(
  "/delivery-boys/approved",
  requireAuth,
  requireAdmin,
  getApprovedDeliveryBoys
);

// ================= USERS =================

router.get(
  "/users",
  requireAuth,
  requireAdmin,
  getAllUsers
);


router.delete(
  "/delivery-boys/:id",
  requireAuth,
  requireAdmin,
  deleteDeliveryBoy
);

router.delete("/users/:id", requireAuth,
  requireAdmin,deleteUser);

router.get("/restaurants", requireAuth,
  requireAdmin, getAllRestaurants);

module.exports = router;