// src/components/structure/EditBillModal.js
import React, { useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";

Modal.setAppElement("#root"); // ปรับให้ตรงกับ ID ของ root element ในโปรเจกต์ของคุณ

export default function EditBillModal({
  isOpen,
  onRequestClose,
  onSubmit,
  bill,
}) {
  const [tableNumber, setTableNumber] = useState(bill.table_number);
  const [items, setItems] = useState(
    bill.bill_items.map((item) => ({
      name: item.menu_name,
      quantity: item.quantity,
      price: item.price,
    }))
  );
  const [totalPrice, setTotalPrice] = useState(bill.total_price);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;
    setItems(updatedItems);

    const newTotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(newTotal);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    const newTotal = updatedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(newTotal);
  };

  const handleSubmit = () => {
    // ตรวจสอบข้อมูล
    if (items.length === 0) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ต้องมีรายการอาหารอย่างน้อยหนึ่งรายการ",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    for (let item of items) {
      if (!item.name || item.quantity <= 0 || item.price < 0) {
        Swal.fire({
          title: "เกิดข้อผิดพลาด!",
          text: "กรุณากรอกข้อมูลรายการอาหารให้ถูกต้อง",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    // ส่งข้อมูล
    onSubmit({
      tableNumber,
      items,
      totalPrice,
      Status: bill.status === "unpaid", 
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="แก้ไขบิล"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-2xl mb-4">แก้ไขบิล</h2>

      <div className="mb-4">
        <label className="block mb-2">โต๊ะ:</label>
        <input
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(Number(e.target.value))}
          className="border p-2 rounded w-full"
          min="1"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">รายการอาหาร:</label>
        {items.map((item, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              placeholder="ชื่อเมนู"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              className="border p-2 rounded w-1/3 mr-2"
            />
            <input
              type="number"
              placeholder="จำนวน"
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="border p-2 rounded w-1/4 mr-2"
              min="1"
            />
            <input
              type="number"
              placeholder="ราคา"
              value={item.price}
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              className="border p-2 rounded w-1/4 mr-2"
              min="0"
              step="0.01"
            />
            <button
              onClick={() => handleRemoveItem(index)}
              className="bg-red-500 text-white px-2 py-1 rounded"
              aria-label={`ลบรายการอาหารที่ ${index + 1}`}
            >
              ลบ
            </button>
          </div>
        ))}
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          เพิ่มรายการอาหาร
        </button>
      </div>

      <div className="mb-4">
        <label className="block mb-2">ราคารวม:</label>
        <input
          type="text"
          value={totalPrice.toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
          readOnly
          className="border p-2 rounded w-full text-center"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onRequestClose}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          บันทึก
        </button>
      </div>
    </Modal>
  );
}
