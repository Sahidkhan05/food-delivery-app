const express = require('express');
const router = express.Router();

const { getEarnings , getDeliveredOrders , markOrderDelivered , updateLocation, getDeliveryBoyDetails,updateDeliveryBoyProfile, acceptDeliveryRequest,rejectDeliveryRequest,getPendingDeliveryRequests, getDeliveryOrders } = require('../controllers/deliveryBoyController');
const verifyTokenAndDeliveryBoy = require('../middlewares/verifyTokenAndDeliveryBoy'); 

// Get delivery boy profile
router.get('/profile', verifyTokenAndDeliveryBoy, getDeliveryBoyDetails);

// Update delivery boy profile
router.put('/profile', verifyTokenAndDeliveryBoy, updateDeliveryBoyProfile);

router.post("/request/:requestId/accept", verifyTokenAndDeliveryBoy, acceptDeliveryRequest);
router.post("/request/:requestId/reject", verifyTokenAndDeliveryBoy, rejectDeliveryRequest);
router.get("/requests", verifyTokenAndDeliveryBoy, getPendingDeliveryRequests);
router.get("/orders", verifyTokenAndDeliveryBoy, getDeliveryOrders);
router.put("/location", verifyTokenAndDeliveryBoy, updateLocation);
router.put("/request/:requestId/deliver", verifyTokenAndDeliveryBoy, markOrderDelivered);
router.get('/delivered', verifyTokenAndDeliveryBoy, getDeliveredOrders);
router.get("/earnings", verifyTokenAndDeliveryBoy, getEarnings);

module.exports = router;