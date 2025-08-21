const express = require('express');
const router = express.Router();
const { addFood, getRestaurantFoods, getAllFoods, deleteFood, updateFood , getFoodByRestaurant } = require('../controllers/foodController');
const authMiddleware = require('../middlewares/authMiddleware');
const verifyTokenAndRestaurant = require('../middlewares/verifyTokenAndRestaurant');
const upload = require('../middlewares/uploadMiddleware');


// Add food (only restaurant can add)
router.post('/add', verifyTokenAndRestaurant, upload.single('image') ,addFood);

// Get all foods by a restaurant
router.get('/my-foods', authMiddleware, getRestaurantFoods);

router.get("/getall", getAllFoods);

router.delete("/:id", authMiddleware, deleteFood);

router.put("/:id", authMiddleware, updateFood);

router.get('/restaurant/:id', getFoodByRestaurant);






module.exports = router;
