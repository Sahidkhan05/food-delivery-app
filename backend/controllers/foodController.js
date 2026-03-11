const Food = require("../models/Food");


// ADD FOOD
exports.addFood = async (req, res) => {
  try {

    const { name, halfPrice, fullPrice, description, category, prepTime, isAvailable } = req.body;

    if (!name || !halfPrice || !fullPrice || !category) {
      return res.status(400).json({
        message: "Name, price and category required"
      });
    }

    if (!req.user || req.user.role !== "restaurant") {
      return res.status(403).json({
        message: "Only restaurants can add food"
      });
    }

    const image = req.file ? req.file.filename : "";

    const food = await Food.create({
      name,
      halfPrice,
      fullPrice,
      description,
      category,
      prepTime,
      isAvailable,
      image,
      restaurant: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      food
    });

  } catch (error) {

    console.error("Add Food Error:", error);

    res.status(500).json({
      message: "Failed to add food",
      error: error.message
    });

  }
};



// GET FOODS OF LOGGED-IN RESTAURANT
exports.getRestaurantFoods = async (req, res) => {
  try {

    const foods = await Food.find({ restaurant: req.user.id });

    res.json({
      success: true,
      foods
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// GET ALL FOODS (FOR USER SIDE)
exports.getAllFoods = async (req, res) => {
  try {

    const foods = await Food.find()
      .populate("restaurant", "name");

    res.json({
      success: true,
      foods
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};



// DELETE FOOD
exports.deleteFood = async (req, res) => {
  try {

    const { id } = req.params;

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    if (food.restaurant.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to delete this food"
      });
    }

    await Food.findByIdAndDelete(id);

    res.status(200).json({
      message: "Food deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to delete food",
      error
    });

  }
};



// UPDATE FOOD
exports.updateFood = async (req, res) => {
  try {

    const { id } = req.params;

    const { name, halfPrice, fullPrice, description, category, prepTime, isAvailable } = req.body;

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    if (food.restaurant.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to update this food"
      });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      {
        name,
        halfPrice,
        fullPrice,
        description,
        category,
        prepTime,
        isAvailable
      },
      { new: true }
    );

    res.status(200).json({
      message: "Food updated",
      food: updatedFood
    });

  } catch (error) {

    res.status(500).json({
      message: "Update failed",
      error
    });

  }
};



// GET FOOD BY RESTAURANT ID (USER SIDE)
exports.getFoodByRestaurant = async (req, res) => {
  try {

    const restaurantId = req.params.id;

    const foods = await Food.find({ restaurant: restaurantId });

    res.status(200).json({
      success: true,
      foods
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};