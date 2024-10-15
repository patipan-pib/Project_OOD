const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    },
});

const upload = multer({ storage });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'my_database',
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL: ', err);
        return;
    }
    console.log("Connected to MySQL database");
});

// Get all menu items
app.get('/menu', (req, res) => {
    db.query("SELECT * FROM menu", (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: 'Error fetching menu items' });
        } else {
            res.send(result);
        }
    });
});

app.get('/menu/:id', (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM menu WHERE ID = ?", [id], (err, result) => {
        if (err) {
            console.error("Error fetching menu item:", err);
            return res.status(500).send({ message: 'Error fetching menu item' });
        }
        if (result.length === 0) {
            return res.status(404).send({ message: 'Menu item not found' });
        }
        res.send(result[0]);
    });
});

// Update menu item
app.put('/menu/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { name, price, type } = req.body;
    let imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Step 1: Retrieve the existing image path from the database
    db.query("SELECT image FROM menu WHERE ID = ?", [id], (err, result) => {
        if (err) {
            console.error("Error fetching existing image path:", err);
            return res.status(500).send({ message: 'Error fetching existing image path' });
        }
        if (result.length === 0) {
            return res.status(404).send({ message: 'Menu item not found' });
        }

        const oldImagePath = result[0].image; // Existing image path from the database
        const fullOldImagePath = path.join(__dirname, oldImagePath); // Full path for deletion

        // Step 2: Delete the old image if a new image is uploaded
        if (imagePath) {
            fs.unlink(fullOldImagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting old image:", unlinkErr);
                    // Optionally, handle this error or log it
                }
            });
        }

        // Step 3: Update the menu item in the database
        let query;
        let params;

        if (imagePath) {
            query = "UPDATE menu SET name = ?, price = ?, type = ?, image = ? WHERE ID = ?";
            params = [name, price, type, imagePath, id];
        } else {
            query = "UPDATE menu SET name = ?, price = ?, type = ? WHERE ID = ?";
            params = [name, price, type, id];
        }

        db.query(query, params, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ message: 'Error updating menu item' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'Menu item not found' });
            }
            res.send({ message: 'Menu item updated successfully' });
        });
    });
});

// Delete menu item by ID
app.delete('/menu/:id', (req, res) => {
    const { id } = req.params;

    // First, retrieve the image path from the database
    db.query("SELECT image FROM menu WHERE ID = ?", [id], (err, result) => {
        if (err) {
            console.error("Error fetching image path:", err);
            return res.status(500).send({ message: 'Error fetching image path' });
        }
        if (result.length === 0) {
            return res.status(404).send({ message: 'Menu item not found' });
        }

        const imagePath = result[0].image; // Assuming 'image' is the column name in your database

        const fullImagePath = path.join(__dirname, imagePath);

        fs.unlink(fullImagePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error("Error deleting image:", unlinkErr);
            }
        });


        // Now delete the menu item from the database
        db.query("DELETE FROM menu WHERE ID = ?", [id], (deleteErr, deleteResult) => {
            if (deleteErr) {
                console.error("Error deleting menu item:", deleteErr);
                return res.status(500).send({ message: 'Error deleting menu item' });
            }
            if (deleteResult.affectedRows === 0) {
                return res.status(404).send({ message: 'Menu item not found' });
            }
            res.send({ message: 'Menu item and image deleted successfully' });
        });
    });
});


// Upload image endpoint
app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    res.status(201).json({ image: imagePath });
});


// Create a new menu item
app.post('/menu/create', upload.single('image'), (req, res) => {
    const { name, price, type } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    db.query("INSERT INTO menu (name, price, type, image) VALUES(?, ?, ?, ?)", [name, price, type, imagePath],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Menu item created', id: result.insertId });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
