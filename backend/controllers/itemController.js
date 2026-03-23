const Item = require('../models/Item');

const defaultItems = [
    { name: "Butter Chicken", description: "Tender chicken in rich creamy tomato sauce with aromatic spices", price: 350, image: "1771938933523.jpg", type: "non-veg", ingredients: "Chicken, Tomato, Butter, Cream, Garam Masala, Ginger, Garlic", isChefSpecial: true },
    { name: "Veg Biryani", description: "Fragrant basmati rice cooked with fresh vegetables and whole spices", price: 220, image: "1771949897053.jpg", type: "veg", ingredients: "Basmati Rice, Mixed Vegetables, Saffron, Whole Spices, Fried Onions", isChefSpecial: false },
    { name: "Chicken Biryani", description: "Aromatic basmati rice layered with spiced chicken and caramelized onions", price: 320, image: "1771938821689.jpg", type: "non-veg", ingredients: "Basmati Rice, Chicken, Yogurt, Saffron, Whole Spices, Fried Onions", isChefSpecial: true },
    { name: "Masala Dosa", description: "Crispy golden rice crepe filled with spiced potato masala", price: 180, image: "1771939122342.jpeg", type: "veg", ingredients: "Rice Batter, Potato, Onion, Mustard Seeds, Curry Leaves, Green Chili", isChefSpecial: false },
    { name: "Paneer Tikka", description: "Smoky grilled cottage cheese marinated in spiced yogurt", price: 280, image: "1771939233037.jpg", type: "veg", ingredients: "Paneer, Yogurt, Bell Peppers, Onion, Tikka Masala, Lemon", isChefSpecial: true },
    { name: "Chicken Tikka", description: "Juicy chicken pieces marinated in spices and grilled to perfection", price: 300, image: "1771939360609.jpg", type: "non-veg", ingredients: "Chicken, Yogurt, Tikka Masala, Ginger, Garlic, Lemon, Chili", isChefSpecial: false },
    { name: "Dal Makhani", description: "Slow-cooked black lentils in rich buttery tomato gravy", price: 200, image: "1771949805826.jpg", type: "veg", ingredients: "Black Lentils, Butter, Cream, Tomato, Ginger, Garlic, Spices", isChefSpecial: false },
    { name: "Tandoori Platter", description: "Assorted tandoor-grilled meats and vegetables with mint chutney", price: 450, image: "1771949827999.jpg", type: "non-veg", ingredients: "Chicken, Seekh Kebab, Paneer, Bell Peppers, Onion, Tandoori Masala", isChefSpecial: true },
    { name: "Chole Bhature", description: "Fluffy deep-fried bread served with spicy chickpea curry", price: 160, image: "1771909585501.png", type: "veg", ingredients: "Chickpeas, Flour, Yogurt, Onion, Tomato, Chole Masala, Ginger", isChefSpecial: false }
];

exports.getItems = async (req, res) => {
    try {
        let items = await Item.find();
        if (items.length === 0) items = await Item.insertMany(defaultItems);
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
};

exports.createItem = async (req, res) => {
    try {
        const { name, price, description, ingredients, type, isChefSpecial } = req.body;
        if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
        
        const item = new Item({ 
            name, 
            price, 
            description, 
            ingredients, 
            type: type || 'veg', 
            isChefSpecial: isChefSpecial === 'true' || isChefSpecial === true, 
            image: req.file?.filename || '' 
        });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create item' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { name, price, description, ingredients, type, isChefSpecial } = req.body;
        if (!name || !price) return res.status(400).json({ error: 'Name and price required' });
        const updateData = { 
            name, 
            price: Number(price), 
            description, 
            ingredients, 
            type, 
            isChefSpecial: isChefSpecial === 'true' || isChefSpecial === true 
        };
        if (req.file) updateData.image = req.file.filename;
        
        const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update item', details: err.message });
    }
};
