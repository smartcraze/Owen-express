const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    ingredients: { type: String, default: 'Ingredients information not available' },
    type: { type: String, enum: ['veg', 'non-veg'], default: 'veg' },
    isChefSpecial: { type: Boolean, default: false },
    prepTime: { type: Number, default: 15 },
    deliveryTime: { type: Number, default: 30 }
}, { versionKey: false });

module.exports = mongoose.model('Item', itemSchema);
