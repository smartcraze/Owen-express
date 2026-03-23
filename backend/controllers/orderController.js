const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
    try {
        const { name, address, phone, email, cart, total, paymentMethod } = req.body;
        if (!cart || cart.length === 0) return res.status(400).json({ error: 'Cart is empty' });
        if (!name || !address || !phone || !email) return res.status(400).json({ error: 'All fields are required' });
        if (isNaN(total) || total <= 0) return res.status(400).json({ error: 'Invalid total amount' });

        const order = new Order({ name, address, phone, email: email.toLowerCase(), cart, total, paymentMethod: paymentMethod || 'cod' });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.rateOrder = async (req, res) => {
    try {
        const { rating, review } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { rating, review },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Rating submitted successfully', order });
    } catch (err) {
        res.status(500).json({ error: 'Failed to submit rating' });
    }
};
