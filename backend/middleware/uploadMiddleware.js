const multer = require('multer');
const path = require('path');

const uploadMiddleware = () => {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname)); // Append extension
        },
    });

    return multer({ storage });
};

module.exports = uploadMiddleware;
