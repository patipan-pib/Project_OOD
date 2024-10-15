// src/components/share/CardSum.js
import React from "react";

const CardSum = ({ item, index, onIncrease, onDecrease, onRemove, onPriceChange }) => {
  const handlePriceChange = (e) => {
    let newPrice = e.target.value;
    if (newPrice === "") {
      newPrice = 0;
    } else {
      newPrice = Number(newPrice);
      if (isNaN(newPrice) || newPrice < 0) {
        newPrice = item.price; // ถ้าไม่ใช่ตัวเลขหรือเป็นลบ ให้คงค่าเดิม
      }
    }
    onPriceChange(index, newPrice);
  };

  return (
    <div className="flex justify-between items-center mb-2 p-2 border rounded">
      <div className="flex-1">
        <span className="mr-2 font-semibold">{index + 1}.</span>
        <span className="font-semibold">{item.name}</span>
        {/* เพิ่ม input สำหรับแก้ไขราคา */}
        <div className="flex items-center mb-1">
          <input
            type="number"
            value={item.price}
            onChange={handlePriceChange}
            className="text-gray-600 border rounded px-2 py-1 w-20 mr-2"
            min="0"
            step="10"
          />{" "}
          บาท
        </div>
        {/* แสดงราคารวมต่อรายการ */}
        <p className="text-gray-600">รวม: {item.price * item.quantity} บาท</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onDecrease(index)}
          aria-label="Decrease quantity"
          className="px-2 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
        >
          -
        </button>
        <span className="px-4">{item.quantity}</span>
        <button
          onClick={() => onIncrease(index)}
          aria-label="Increase quantity"
          className="px-2 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
        >
          +
        </button>
        <button
          onClick={() => onRemove(index)}
          aria-label="Remove item"
          className="ml-4 text-red-500 hover:text-red-700"
        >
          ลบ
        </button>
      </div>
    </div>
  );
};

export default CardSum;
