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
    } catch {
        res.status(500).json({ error: 'Failed to create order' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ email: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
        res.json(orders);
    } catch {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status, prepTime, deliveryTime } = req.body;
        const validStatuses = ['pending', 'accepted', 'rejected', 'preparing', 'out_for_delivery', 'delivered'];
        if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
        
        const updateData = { status };
        if (prepTime) updateData.prepTime = prepTime;
        if (deliveryTime) updateData.deliveryTime = deliveryTime;
        
        if (status === 'accepted') updateData.acceptedAt = new Date();
        if (status === 'out_for_delivery') updateData.outForDeliveryAt = new Date();

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Status updated', order });
    } catch {
        res.status(500).json({ error: 'Failed to update status' });
    }
};

exports.getOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).select('status prepTime deliveryTime acceptedAt outForDeliveryAt');
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(order);
    } catch {
        res.status(500).json({ error: 'Failed to fetch status' });
    }
};

exports.rateOrder = async (req, res) => {
    try {
        const { rating, review } = req.body;
        if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { rating: Number(rating), review: review || '' },
            { new: true }
        );
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json({ message: 'Rating submitted successfully', order });
    } catch {
        res.status(500).json({ error: 'Failed to submit rating' });
    }
};
