require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const Item = require('./models/Item');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function run() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    const result = await cloudinary.api.resources({ type: 'upload', prefix: 'owen-express', max_results: 50 });
    const urls = result.resources.map(r => r.secure_url);

    console.log('\nCloudinary images found:');
    urls.forEach((u, i) => console.log(`${i}: ${u}`));

    const items = await Item.find();
    console.log(`\nItems in DB: ${items.length}`);

    for (let i = 0; i < items.length; i++) {
        if (urls[i]) {
            await Item.findByIdAndUpdate(items[i]._id, { image: urls[i] });
            console.log(`Updated "${items[i].name}" → ${urls[i]}`);
        }
    }

    console.log('\nDone!');
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
