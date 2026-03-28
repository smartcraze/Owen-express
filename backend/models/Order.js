const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    cart: { type: Array, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['upi', 'credit', 'cod'], default: 'cod' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'preparing', 'out_for_delivery', 'delivered'], default: 'pending' },
    rating: { type: Number, min: 1, max: 5, default: null },
    review: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
