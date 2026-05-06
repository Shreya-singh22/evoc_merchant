// 1. Load environment variables first!
// This reads the .env file and makes the variables available in process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to receive JSON in requests

// API Routes
const productRoutes = require('./routes/products.routes');
const categoryRoutes = require('./routes/categories.routes');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// A simple test route
app.get('/', (req, res) => {
    res.json({ message: "evoc-backend is running!" });
});

// Start the server using the PORT from the .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

    // This is just to prove that dotenv is working! You can delete this console.log later.
    console.log(`Catalog API URL is set to: ${process.env.CATALOG_API_URL}`);
});
