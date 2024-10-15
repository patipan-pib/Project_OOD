// routes/createMenuRoutes.js
const express = require('express');
const fs = require('fs').promises; // Use promise-based fs methods
const path = require('path');
const multer = require('multer');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();
const upload = uploadMiddleware();

const createMenuRoutes = (db) => {

    // GET all menu items
    router.get('/', async (req, res) => {
        try {
            const [rows] = await db.execute("SELECT * FROM menu");
            res.status(200).json(rows);
        } catch (err) {
            console.error("Error fetching menu items:", err);
            res.status(500).json({ message: 'Error fetching menu items' });
        }
    });

    // GET a single menu item by ID
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const [result] = await db.execute("SELECT * FROM menu WHERE ID = ?", [id]);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Menu item not found' });
            }
            res.status(200).json(result[0]);
        } catch (err) {
            console.error("Error fetching menu item:", err);
            res.status(500).json({ message: 'Error fetching menu item' });
        }
    });

    // PUT update a menu item by ID
    router.put('/:id', upload.single('image'), async (req, res) => {
        const { id } = req.params;
        const { name, price, type } = req.body;
        let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        try {
            // Fetch existing image path
            const [result] = await db.execute("SELECT image FROM menu WHERE ID = ?", [id]);
            if (result.length === 0) {
                // If a new image was uploaded, delete it since the menu item doesn't exist
                if (imagePath) {
                    await fs.unlink(path.join(__dirname, '..', imagePath));
                }
                return res.status(404).json({ message: 'Menu item not found' });
            }

            const oldImagePath = result[0].image; 
            if (imagePath && oldImagePath) {
                const fullOldImagePath = path.join(__dirname, '..', oldImagePath);
                try {
                    await fs.unlink(fullOldImagePath);
                    console.log(`Deleted old image at ${fullOldImagePath}`);
                } catch (unlinkErr) {
                    console.error("Error deleting old image:", unlinkErr);
                    // Proceed even if deleting the old image fails
                }
            }

            // Construct the update query
            let query = "UPDATE menu SET name = ?, price = ?, type = ?";
            let params = [name, price, type];
            if (imagePath) {
                query += ", image = ?";
                params.push(imagePath);
            }
            query += " WHERE ID = ?";
            params.push(id);

            const [updateResult] = await db.execute(query, params);
            if (updateResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Menu item not found' });
            }
            res.status(200).json({ message: 'Menu item updated successfully' });
        } catch (err) {
            console.error("Error updating menu item:", err);
            res.status(500).json({ message: 'Error updating menu item', error: err.message });
        }
    });

    // DELETE a menu item by ID
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            // Fetch existing image path
            const [result] = await db.execute("SELECT image FROM menu WHERE ID = ?", [id]);
            if (result.length === 0) {
                return res.status(404).json({ message: 'Menu item not found' });
            }

            const imagePath = result[0].image; // Assuming 'image' is the column name

            if (imagePath) {
                const fullImagePath = path.join(__dirname, '..', imagePath);
                // console.log(fullImagePath)
                try {
                    await fs.unlink(fullImagePath);
                    console.log(`Deleted image at ${fullImagePath}`);
                } catch (unlinkErr) {
                    console.error("Error deleting image:", unlinkErr);
                    // Proceed even if deleting the image fails
                }
            }

            // Delete the menu item from the database
            const [deleteResult] = await db.execute("DELETE FROM menu WHERE ID = ?", [id]);
            if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ message: 'Menu item not found' });
            }
            res.status(200).json({ message: 'Menu item and image deleted successfully' });
        } catch (err) {
            console.error("Error deleting menu item:", err);
            res.status(500).json({ message: 'Error deleting menu item', error: err.message });
        }
    });

    // POST create a new menu item
    router.post('/create', upload.single('image'), async (req, res) => {
        const { name, price, type } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        try {
            const [result] = await db.execute(
                "INSERT INTO menu (name, price, type, image) VALUES (?, ?, ?, ?)",
                [name, price, type, imagePath]
            );
            res.status(201).json({ message: 'Menu item created', id: result.insertId });
        } catch (err) {
            console.error("Error creating menu item:", err);
            res.status(500).json({ message: 'Error creating menu item', error: err.message });
        }
    });

    return router;
};

module.exports = createMenuRoutes;
