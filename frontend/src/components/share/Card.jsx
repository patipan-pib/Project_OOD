import React from "react";
import { FaCheckCircle } from "react-icons/fa";

function Card({ index, imgsrc, name, price, onClick, isSelected, quantity }) {
	return (
    <div
      key={index}
      className="relative border rounded-lg shadow-lg p-4 mr-2 bg-white hover:shadow-xl transition-shadow"
      onClick={onClick}
    >
      <img
        src={imgsrc}
        alt={name}
        className="w-full h-48 object-cover rounded-t-lg mb-2"
      />
      <div className="py-3 text-start">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-lg text-gray-700">Price: {price}฿</p>

        {isSelected && (
        <div className="absolute bottom-6 right-4 flex items-center bg-white rounded-full p-1">
          <FaCheckCircle className="text-green-500" />
          <span className="ml-1 text-xl font-medium">{quantity}</span>
        </div>
      )}
      </div>
    </div>
  );
}

export default Card;
