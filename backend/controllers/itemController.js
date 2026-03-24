const Item = require('../models/Item');

const cloudinaryImages = [
    'https://res.cloudinary.com/dmpnejk1t/image/upload/v1774295594/owen-express/c7uz0pyqfyyh95rnzm2v.jpg',
    'https://res.cloudinary.com/dmpnejk1t/image/upload/v1774296331/owen-express/ey64gqfrijmmhj7qooyj.jpg',
    'https://res.cloudinary.com/dmpnejk1t/image/upload/v1774296930/owen-express/gjx5zmylt0mmpib7mgo4.jpg',
    'https://res.cloudinary.com/dmpnejk1t/image/upload/v1774297366/owen-express/jbvw0wdz7kwywhgwufoi.jpg',
    'https://res.cloudinary.com/dmpnejk1t/image/upload/v1774295733/owen-express/jlc7xavvveupx1indzw0.jpg',
    'https://res.cloudinary.com/dmpnejk1t/image/upload/v1774296828/owen-express/jwfoeowbkuzespnk6osw.jpg',
    'https://res.cloudinary.com/dmpnejk1t/image/upload/v1774296251/owen-express/ve7xp1dw2qo2tnmkh5ah.jpg',
    'https://res.cloudinary.com/dmpnejk1t/image/upload/v1774295447/owen-express/y7tzyn8ikm1oanlrvq5o.jpg',
];

const defaultItems = [
    { name: "Butter Chicken", description: "Tender chicken in rich creamy tomato sauce with aromatic spices", price: 350, image: cloudinaryImages[0], type: "non-veg", ingredients: "Chicken, Tomato, Butter, Cream, Garam Masala, Ginger, Garlic", isChefSpecial: true },
    { name: "Veg Biryani", description: "Fragrant basmati rice cooked with fresh vegetables and whole spices", price: 220, image: cloudinaryImages[1], type: "veg", ingredients: "Basmati Rice, Mixed Vegetables, Saffron, Whole Spices, Fried Onions", isChefSpecial: false },
    { name: "Chicken Biryani", description: "Aromatic basmati rice layered with spiced chicken and caramelized onions", price: 320, image: cloudinaryImages[2], type: "non-veg", ingredients: "Basmati Rice, Chicken, Yogurt, Saffron, Whole Spices, Fried Onions", isChefSpecial: true },
    { name: "Masala Dosa", description: "Crispy golden rice crepe filled with spiced potato masala", price: 180, image: cloudinaryImages[3], type: "veg", ingredients: "Rice Batter, Potato, Onion, Mustard Seeds, Curry Leaves, Green Chili", isChefSpecial: false },
    { name: "Paneer Tikka", description: "Smoky grilled cottage cheese marinated in spiced yogurt", price: 280, image: cloudinaryImages[4], type: "veg", ingredients: "Paneer, Yogurt, Bell Peppers, Onion, Tikka Masala, Lemon", isChefSpecial: true },
    { name: "Chicken Tikka", description: "Juicy chicken pieces marinated in spices and grilled to perfection", price: 300, image: cloudinaryImages[5], type: "non-veg", ingredients: "Chicken, Yogurt, Tikka Masala, Ginger, Garlic, Lemon, Chili", isChefSpecial: false },
    { name: "Dal Makhani", description: "Slow-cooked black lentils in rich buttery tomato gravy", price: 200, image: cloudinaryImages[6], type: "veg", ingredients: "Black Lentils, Butter, Cream, Tomato, Ginger, Garlic, Spices", isChefSpecial: false },
    { name: "Tandoori Platter", description: "Assorted tandoor-grilled meats and vegetables with mint chutney", price: 450, image: cloudinaryImages[7], type: "non-veg", ingredients: "Chicken, Seekh Kebab, Paneer, Bell Peppers, Onion, Tandoori Masala", isChefSpecial: true },
    { name: "Chole Bhature", description: "Fluffy deep-fried bread served with spicy chickpea curry", price: 160, image: cloudinaryImages[0], type: "veg", ingredients: "Chickpeas, Flour, Yogurt, Onion, Tomato, Chole Masala, Ginger", isChefSpecial: false }
];

exports.getItems = async (req, res) => {
    try {
        let items = await Item.find();
        if (items.length === 0) {
            items = await Item.insertMany(defaultItems);
        } else {
            // patch any items with blank images
            const blanks = items.filter(i => !i.image);
            for (let i = 0; i < blanks.length; i++) {
                const url = cloudinaryImages[i % cloudinaryImages.length];
                await Item.findByIdAndUpdate(blanks[i]._id, { image: url });
            }
            items = await Item.find();
        }
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
            image: req.file?.path || '' 
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
        if (req.file) updateData.image = req.file.path;
        else updateData.image = (await Item.findById(req.params.id))?.image || '';
        
        const item = await Item.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update item', details: err.message });
    }
};
