// server.js
const express = require('express');
const cors = require('cors');
const { createConnection } = require('./config');
const menuRoutes = require('./routes/menuRoutes');
const createBillRoutes = require('./routes/createBillRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = 3001;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // หรือ URL ของ frontend ของคุณ
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// ฟังก์ชันสำหรับสร้างตารางหากไม่พบ
const initializeDatabase = async (db) => {
    try {
        // สร้างตาราง bills หากไม่พบ
        await db.execute(`
            CREATE TABLE IF NOT EXISTS bills (
                id INT AUTO_INCREMENT PRIMARY KEY,
                total_price DECIMAL(10, 2) NOT NULL,
                table_number INT NOT NULL,
                status ENUM('unpaid', 'paid', 'cancelled') DEFAULT 'unpaid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // สร้างตาราง bill_items หากไม่พบ
        await db.execute(`
            CREATE TABLE IF NOT EXISTS bill_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                bill_id INT NOT NULL,
                menu_name VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (bill_id) REFERENCES bills(id) ON DELETE CASCADE
            )
        `);

        // สร้างตาราง menu หากไม่พบ
        await db.execute(`
            CREATE TABLE IF NOT EXISTS menu (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                type VARCHAR(100) NOT NULL,
                image VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('All necessary tables are ensured to exist.');
    } catch (error) {
        console.error('Error initializing database tables:', error);
        throw error; // ยกข้อผิดพลาดต่อไปยังฟังก์ชันที่เรียกใช้
    }
};

// Async function to initialize the server after DB connection
const init = async () => {
    try {
        const db = await createConnection();
        console.log('Database connected successfully.');

        // เรียกใช้ฟังก์ชันสร้างตาราง
        await initializeDatabase(db);

        // เพิ่ม logging middleware
        app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });

        app.use('/uploads', express.static('uploads'));
        app.use('/menu', menuRoutes(db)); // http://localhost:3001/menu/
        app.use('/bills', createBillRoutes(db));
        app.use('/upload', uploadRoutes());

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize the server:', error);
        process.exit(1); // Exit the process with failure
    }
};

init();
