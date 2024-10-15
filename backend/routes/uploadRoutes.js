const express = require('express');
const multer = require('multer');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();
const upload = uploadMiddleware();

router.post('/', upload.single('image'), (req, res) => {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    res.status(201).json({ image: imagePath });
});

module.exports = () => {
    return router;
};
