const { createConnection } = require('../config');
const fs = require('fs').promises;  // Use fs.promises for async/await
const path = require('path');

const db = createConnection();

(async () => {
    try {
        // ลบข้อมูลจากฐานข้อมูล
        await db.query("DELETE FROM menu");
        console.log("All items deleted successfully from the database.");

        // ลบไฟล์ทั้งหมดในโฟลเดอร์ uploads
        const uploadsDir = path.join(__dirname, '../uploads');
        console.log(uploadsDir);

        // อ่านไฟล์ทั้งหมดในโฟลเดอร์
        const files = await fs.readdir(uploadsDir);
        
        // ลบแต่ละไฟล์ในโฟลเดอร์
        for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            try {
                await fs.unlink(filePath);
                console.log(`File ${file} deleted successfully.`);
            } catch (unlinkErr) {
                console.error(`Error deleting file ${file}:`, unlinkErr);
            }
        }
    } catch (err) {
        console.error("Error during operation:", err);
    } finally {
        // ปิดการเชื่อมต่อฐานข้อมูล
        db.end();
    }
})();
