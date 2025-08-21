const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const deliveryBoyRoutes = require('./routes/deliveryBoyRoutes');


const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foodexpress';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ MongoDB connection error:", err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/food', foodRoutes);
app.use("/api/order", orderRoutes);
app.use('/api', uploadRoutes);  // POST /api/upload
app.use('/uploads', express.static('uploads'));
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/deliveryboy', deliveryBoyRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send("🚀 API is running");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
