const { createConnection } = require('../config');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const db = createConnection();
// const query = promisify(db.query).bind(db);

async function copyAndRenameFile(oldFilename, newFilename) {
    try {
        // Copy the file to the new location with a new name
        await fs.promises.copyFile(oldFilename, newFilename);
        console.log(`File copied and renamed from ${oldFilename} to ${newFilename}`);
        return newFilename;
    } catch (err) {
        console.error(`Error copying and renaming file: ${err}`);
        throw err;  // Propagate the error
    }
}

// Read items from the JSON file
fs.readFile('data.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        return;
    }

    const items = JSON.parse(data);

    // Iterate over items to insert into the database
    for (const item of items) {
        const { name, price, type, image } = item;
        const oldPath = path.join(__dirname, 'ood_image', image);
        const newFileName = `${Date.now()}_${image}`; // Use image name with timestamp to avoid overwrites
        const newPath = path.join(path.dirname(__dirname), 'uploads', newFileName);

        try {
            await copyAndRenameFile(oldPath, newPath);
            const img_new = `/uploads/${newFileName}`;

            // Insert into the database
            db.query(
                "INSERT INTO menu (name, price, type, image) VALUES (?, ?, ?, ?)",
                [name, price, type, img_new]
            );
            console.log(`Inserted item: ${name}`);
        } catch (err) {
            console.error(`Error processing item ${name}:`, err);
        }
    }

    // Close the database connection
    db.end();
});
