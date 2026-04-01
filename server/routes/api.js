const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const { MenuCategory, MenuItem } = require('../models/Menu');
const Order = require('../models/Order');
const Admin = require('../models/Admin');
const Review = require('../models/Review');
// const bcrypt = require('bcryptjs'); // Uncomment when adding auth
// const jwt = require('jsonwebtoken'); // Uncomment when adding auth

// --- Customer Routes ---

// Customer Login / Verification
router.post('/customer/login', async (req, res) => {
    try {
        const { phoneNumber, tableNumber, name } = req.body;
        if (!phoneNumber || !tableNumber || !name) {
            return res.status(400).json({ msg: 'Name, phone and table number are required' });
        }

        let customer = await Customer.findOne({ phoneNumber });
        if (!customer) {
            customer = new Customer({ phoneNumber, name });
            await customer.save();
        } else {
            customer.name = name; // Update name if it changed
            customer.lastLogin = Date.now();
            await customer.save();
        }

        res.json({ customer, tableNumber });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Menu Routes ---

// Get all menu items grouped by category
router.get('/menu', async (req, res) => {
    try {
        const categories = await MenuCategory.find().sort({ displayOrder: 1 });
        const menuData = [];

        for (const category of categories) {
            const items = await MenuItem.find({ categoryId: category._id, isAvailable: true });
            menuData.push({
                category,
                items
            });
        }

        res.json(menuData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Order Routes ---

// Place a new order
router.post('/orders', async (req, res) => {
    try {
        const { customerId, tableNumber, items, totalAmount, paymentMethod } = req.body;

        // In a real app, validate item prices and availability here

        const newOrder = new Order({
            customer: customerId,
            tableNumber,
            items,
            totalAmount,
            paymentMethod,
            orderStatus: 'Pending'
        });

        const order = await newOrder.save();
        const populatedOrder = await Order.findById(order._id).populate('customer').populate('items.item');

        // Emit socket event to admin
        const io = req.app.get('io');
        io.emit('newOrder', populatedOrder);

        res.json(populatedOrder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get order status (for customer polling if needed, though socket is better)
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.item');
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Admin Routes ---

// --- Waiter Call Route ---
router.post('/waiter/call', (req, res) => {
    try {
        const { tableNumber } = req.body;
        const io = req.app.get('io');
        io.emit('waiterCall', { tableNumber, time: new Date() });
        res.json({ msg: 'Waiter called' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Admin Routes ---

// Admin Login (Simplified for prototype)
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    // In real app, use bcrypt to compare password
    if (username === 'admin' && password === 'admin123') {
        res.json({ token: 'dummy_token', user: { username: 'admin' } });
    } else {
        res.status(401).json({ msg: 'Invalid credentials' });
    }
});

// Get all active orders (for admin dashboard)
router.get('/admin/orders', async (req, res) => {
    try {
        // Fetch orders that are not completed or cancelled
        const orders = await Order.find({ status: { $nin: ['Completed', 'Cancelled'] } })
            .populate('customer')
            .populate('items.item')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update order status
router.put('/admin/orders/:id/status', async (req, res) => {
    try {
        const { status, preparationTime } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ msg: 'Order not found' });

        order.status = status;
        if (preparationTime) {
            order.preparationTime = preparationTime;
            // Calculate estimated ready time
            const readyTime = new Date();
            readyTime.setMinutes(readyTime.getMinutes() + parseInt(preparationTime));
            order.estimatedReadyTime = readyTime;
        }

        await order.save();

        // Emit update to customer (room based on order ID or table would be better, broadcasting for now)
        const io = req.app.get('io');
        io.emit('orderStatusUpdate', order);

        res.json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Menu Management Routes ---

// Add new menu item
router.post('/menu', async (req, res) => {
    try {
        const { categoryId, itemName, price, description } = req.body;
        const newItem = new MenuItem({
            categoryId,
            itemName,
            price,
            description
        });
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete menu item
router.delete('/menu/:id', async (req, res) => {
    try {
        await MenuItem.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Reports Routes ---

// Get Reports Data
router.get('/admin/reports', async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const completedOrders = await Order.countDocuments({ status: 'Completed' });

        // Calculate total revenue
        const revenueResult = await Order.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Calculate Average Rating
        const ratingResult = await Review.aggregate([
            { $group: { _id: null, average: { $avg: '$rating' } } }
        ]);
        const averageRating = ratingResult.length > 0 ? ratingResult[0].average : 0;

        res.json({
            totalOrders,
            completedOrders,
            totalRevenue,
            averageRating
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- Review Routes ---

// Post a new review
router.post('/reviews', async (req, res) => {
    try {
        const { orderId, customerId, rating, comment } = req.body;

        const newReview = new Review({
            order: orderId,
            customer: customerId,
            rating,
            comment
        });

        const review = await newReview.save();
        res.json(review);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all reviews (for admin)
router.get('/admin/reviews', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('order')
            .populate('customer')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Dismiss/Delete a review
router.delete('/admin/reviews/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Review dismissed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
