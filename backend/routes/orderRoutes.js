const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders  , getOrdersForRestaurant, updateOrderStatus  } = require('../controllers/orderController');
const requireAuth = require('../middlewares/authMiddleware');
const verifyTokenAndRestaurant = require('../middlewares/verifyTokenAndRestaurant');

// Protect all routes below
router.use(requireAuth);

// Place a new order
router.post('/place', placeOrder);

// Get orders for logged-in user
router.get('/my-orders', getUserOrders);

router.get('/restaurant-orders', verifyTokenAndRestaurant, getOrdersForRestaurant);

router.put('/:orderId/status', requireAuth, updateOrderStatus);

module.exports = router;
