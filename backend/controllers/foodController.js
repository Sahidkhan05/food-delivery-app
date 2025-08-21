const Food = require('../models/Food');

// Add Food
exports.addFood = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    if (req.user.role !== 'restaurant') {
      return res.status(403).json({ message: 'Only restaurants can add food' });
    }

    const image = req.file ? req.file.filename : null;

    const food = await Food.create({
      name,
      price,
      description,
      image,
      restaurant: req.user._id,
    });

    res.status(201).json({ success: true, food });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all foods of logged-in restaurant
exports.getRestaurantFoods = async (req, res) => {
  try {
    console.log("Request User Info:", req.user); // debug
    const foods = await Food.find({ restaurant: req.user.id }); // <-- ✅ FIXED
    res.json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all foods (for user view)
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("restaurant", "restaurantName address"); 
    res.json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE food by ID

// DELETE food by ID with ownership check
exports.deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.restaurant.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this food" });
    }

    await Food.findByIdAndDelete(id);
    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete food", error });
  }
};



// UPDATE food by ID with ownership check
exports.updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const food = await Food.findById(id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    if (food.restaurant.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this food" });
    }

    const updatedFood = await Food.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true }
    );

    res.status(200).json({ message: "Food updated", food: updatedFood });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error });
  }
};


exports.getFoodByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;

    const foods = await Food.find({ restaurant: restaurantId });

    res.status(200).json({ success: true, foods });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
