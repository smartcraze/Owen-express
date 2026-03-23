const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '../frontend/public/images/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = /jpeg|jpg|png|gif/;
        const valid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
        valid ? cb(null, true) : cb(new Error('Images only!'));
    }
});

module.exports = upload;
