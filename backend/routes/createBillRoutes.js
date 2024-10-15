const express = require('express');
const router = express.Router();

const createBillRoutes = (db) => {

    router.post('/create', async (req, res) => {
        const { items, totalPrice, tableNumber, Status } = req.body;  // เปลี่ยน 'table' เป็น 'tableNumber'
        console.log(tableNumber, Status);

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'ไม่มีรายการเมนูที่เลือก' });
        }

        if (typeof totalPrice !== 'number' || totalPrice <= 0) {
            return res.status(400).json({ message: 'ราคารวมไม่ถูกต้อง' });
        }

        if (!tableNumber) {
            return res.status(400).json({ message: 'หมายเลขโต๊ะไม่ถูกต้อง' });
        }

        let connection;

        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            const [billResult] = await connection.execute(
                'INSERT INTO bills (total_price, table_number, status) VALUES (?, ?, ?)',
                [totalPrice, tableNumber, Status]
            );
            const billId = billResult.insertId;

            const billItemsPromises = items.map(item => {
                const { name, quantity, price } = item;
                return connection.execute(
                    'INSERT INTO bill_items (bill_id, menu_name, quantity, price) VALUES (?, ?, ?, ?)',
                    [billId, name, quantity, price]
                );
            });

            await Promise.all(billItemsPromises);

            await connection.commit();
            res.status(201).json({ message: 'สร้างบิลสำเร็จ', billId });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.error("Error creating bill:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: error.message });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    });


    router.get('/unpaid', async (req, res) => {
        try {
            // ดึงบิลทั้งหมดที่ยังไม่ชำระเงิน
            const [bills] = await db.execute("SELECT * FROM bills WHERE status = 'unpaid'");

            if (bills.length === 0) {
                return res.status(200).json([]);
            }

            // ดึง bill_id ทั้งหมด
            const billIds = bills.map(bill => bill.ID);

            // ดึงรายการอาหารสำหรับบิลทั้งหมด
            const [billItems] = await db.query("SELECT * FROM bill_items WHERE bill_id IN (?)", [billIds]);

            // จัดกลุ่มรายการอาหารตาม bill_id
            const billItemsGrouped = billItems.reduce((acc, item) => {
                if (!acc[item.bill_id]) {
                    acc[item.bill_id] = [];
                }
                acc[item.bill_id].push(item);
                return acc;
            }, {});

            // รวมข้อมูลบิลกับรายการอาหาร
            const billsWithItems = bills.map(bill => ({
                ...bill,
                bill_items: billItemsGrouped[bill.ID] || []
            }));

            res.status(200).json(billsWithItems);
        } catch (err) {
            console.error("Error fetching bills and bill items:", err);
            res.status(500).json({ message: 'Error fetching bills and bill items' });
        }
    });

    router.get('/history', async (req, res) => {
        // res.status(200).json({ message: 'ยกเลิกบิลสำเร็จ' });
        try {
            const [bills] = await db.execute("SELECT * FROM bills WHERE status IN ('paid', 'cancelled') ORDER BY created_at DESC");

            if (bills.length === 0) {
                return res.status(200).json([]);
            }

            // ดึง bill_id ทั้งหมด
            const billIds = bills.map(bill => bill.ID);

            // ดึงรายการอาหารสำหรับบิลทั้งหมด
            const [billItems] = await db.query("SELECT * FROM bill_items WHERE bill_id IN (?)", [billIds]);

            // จัดกลุ่มรายการอาหารตาม bill_id
            const billItemsGrouped = billItems.reduce((acc, item) => {
                if (!acc[item.bill_id]) {
                    acc[item.bill_id] = [];
                }
                acc[item.bill_id].push(item);
                return acc;
            }, {});

            // รวมข้อมูลบิลกับรายการอาหาร
            const billsWithItems = bills.map(bill => ({
                ...bill,
                bill_items: billItemsGrouped[bill.ID] || []
            }));

            res.status(200).json(billsWithItems);
        } catch (err) {
            console.error("Error fetching history bills and bill items:", err);
            res.status(500).json({ message: 'Error fetching history bills and bill items' });
        }
    });
    // ดึงข้อมูลบิลตาม ID พร้อมรายการเมนู
    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            // ดึงข้อมูลบิลจากตาราง 'bills'
            const [billResult] = await db.execute("SELECT * FROM bills WHERE id = ?", [id]);

            // ดึงรายการเมนูจากตาราง 'bill_items'
            const [menu] = await db.execute("SELECT * FROM bill_items WHERE bill_id = ?", [id]);

            // ตรวจสอบว่าบิลมีอยู่หรือไม่
            if (billResult.length === 0) {
                return res.status(404).json({ message: 'Bill not found' });
            }

            // ส่งข้อมูลบิลและรายการเมนู
            res.status(200).json({
                bill: billResult[0],
                bill_items: menu
            });
        } catch (err) {
            console.error("Error fetching bill and bill items:", err);
            res.status(500).json({ message: 'Error fetching bill and bill items' });
        }
    });

    // ชำระเงินบิล
    router.put('/:id/pay', async (req, res) => {
        const { id } = req.params;

        try {
            const [result] = await db.execute("UPDATE bills SET status = 'paid' WHERE id = ?", [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Bill not found or already paid' });
            }

            res.status(200).json({ message: 'ชำระเงินบิลสำเร็จ' });
        } catch (err) {
            console.error("Error paying bill:", err);
            res.status(500).json({ message: 'Error paying bill' });
        }
    });

    router.put('/:id/cancel', async (req, res) => {
        const { id } = req.params;

        try {
            const [result] = await db.execute("UPDATE bills SET status = 'cancelled' WHERE id = ?", [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Bill not found or already paid' });
            }

            res.status(200).json({ message: 'ยกเลิกบิลสำเร็จ' });
        } catch (err) {
            console.error("Error paying bill:", err);
            res.status(500).json({ message: 'Error paying bill' });
        }
    });

    // ยกเลิกบิล
    router.delete('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const connection = await db.getConnection();
            await connection.beginTransaction();

            // ลบรายการเมนูในบิล
            await connection.execute("DELETE FROM bill_items WHERE bill_id = ?", [id]);

            // ลบบิล
            const [result] = await connection.execute("DELETE FROM bills WHERE id = ?", [id]);

            if (result.affectedRows === 0) {
                await connection.rollback();
                connection.release();
                return res.status(404).json({ message: 'Bill not found' });
            }

            await connection.commit();
            connection.release();

            res.status(200).json({ message: 'ยกเลิกบิลสำเร็จ' });
        } catch (err) {
            console.error("Error cancelling bill:", err);
            res.status(500).json({ message: 'Error cancelling bill' });
        }
    });

    router.put('/:id/edit', async (req, res) => {
        const { id } = req.params;
        const { items, totalPrice, tableNumber, Status } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'ไม่มีรายการเมนูที่เลือก' });
        }

        if (!totalPrice || typeof totalPrice !== 'number') {
            return res.status(400).json({ message: 'ราคารวมไม่ถูกต้อง' });
        }

        let connection;

        try {
            connection = await db.getConnection();
            await connection.beginTransaction();

            // อัปเดตข้อมูลบิล
            const [updateBillResult] = await connection.execute(
                'UPDATE bills SET total_price = ?, table_number = ?, status = ? WHERE ID = ?',
                [totalPrice, tableNumber, Status ? 'unpaid' : 'paid', id]
            );

            if (updateBillResult.affectedRows === 0) {
                throw new Error('ไม่พบบิลที่ต้องการแก้ไข');
            }

            // ลบรายการอาหารเดิมทั้งหมดในบิลนี้
            await connection.execute(
                'DELETE FROM bill_items WHERE bill_id = ?',
                [id]
            );

            // เพิ่มรายการอาหารใหม่เข้าไป
            const billItemsPromises = items.map(item => {
                const { name, quantity, price } = item;
                return connection.execute(
                    'INSERT INTO bill_items (bill_id, menu_name, quantity, price) VALUES (?, ?, ?, ?)',
                    [id, name, quantity, price]
                );
            });

            await Promise.all(billItemsPromises);

            await connection.commit();
            res.status(200).json({ message: 'แก้ไขบิลสำเร็จ', billId: id });
        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            console.error("Error editing bill:", error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์', error: error.message });
        } finally {
            if (connection) {
                connection.release();
            }
        }
    });

    

    return router;
}

module.exports = createBillRoutes;