require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.api.resources({ type: 'upload', prefix: 'owen-express', max_results: 50 })
    .then(result => {
        console.log('\nCloudinary images:');
        result.resources.forEach((r, i) => console.log(`${i + 1}. ${r.secure_url}`));
    })
    .catch(err => console.error(err.message));
