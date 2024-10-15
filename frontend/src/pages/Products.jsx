// src/pages/Product.jsx
import React, { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { deleteMenu } from "../API/Menu";
import DeleteModal from "../components/structure/DeleteModal";
import { FcFilledFilter, FcDeleteDatabase } from "react-icons/fc";
import { TailSpin } from "react-loader-spinner";
import { MenuContext } from "../contexts/MenuContext";

export default function Products() {
  const { menuList, isLoading, error, refreshMenu } = useContext(MenuContext);
  const [typeFilter, setTypeFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const openModal = (menu) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMenu(null);
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    if (selectedMenu) {
      try {
        await deleteMenu(selectedMenu.ID);
        console.log(`Delete menu with ID: ${selectedMenu.ID}`);
        refreshMenu(); // รีเฟรชเมนูหลังจากลบสำเร็จ
        closeModal();
      } catch (error) {
        console.error(
          "Error deleting menu item:",
          error.response ? error.response.data : error.message
        );
        alert("ลบเมนูไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        closeModal();
      }
    }
  };

  const filteredMenu = useMemo(() => {
    return menuList
      .filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((item) =>
        categoryFilter && categoryFilter !== "All"
          ? item.category === categoryFilter
          : true
      )
      .filter((item) => (typeFilter ? item.type === typeFilter : true));
  }, [menuList, searchQuery, categoryFilter, typeFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Items</h1>
      <div className="flex items-start justify-center">
        <div className="w-1/6 flex items-center justify-center">
          <label htmlFor="type">
            <FcFilledFilter className="mr-4" style={{ fontSize: "2rem" }} />
          </label>
          <select
            id="type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border p-2 rounded w-3/4"
            aria-label="Filter by Type"
          >
            <option value="">All</option>
            <option value="id_1">เมนูตำ</option>
            <option value="id_2">เมนูยำ</option>
            <option value="id_3">เมนูทอด</option>
            <option value="id_4">เมนูผัด</option>
            <option value="id_5">เมนูต้ม</option>
            <option value="id_6">เมนูย่าง</option>
          </select>
        </div>
        <input
          type="text"
          placeholder="ค้นหารายการ"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mb-4 rounded w-5/6"
          aria-label="Search Menu Items"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div
            className="flex justify-center items-center h-full col-span-full"
            aria-live="polite"
          >
            <TailSpin
              height="80"
              width="80"
              color="#00BFFF"
              ariaLabel="loading"
            />
          </div>
        ) : error ? (
          <p className="text-red-500 col-span-full">{error}</p>
        ) : filteredMenu.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-[60vh] w-[95vw]">
            <FcDeleteDatabase
              className="opacity-50"
              style={{ fontSize: "10rem" }}
            />
            <p className="text-gray-500 mt-4 text-lg">ไม่พบรายการ</p>
          </div>
        ) : (
          filteredMenu.map((val) => (
            <div
              key={val.ID}
              className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition-shadow"
            >
              <img
                src={`http://localhost:3001${val.image}`}
                alt={val.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h2 className="text-lg font-semibold">{val.name}</h2>
              <p className="text-gray-700">Price: {val.price} ฿</p>
              {/* <p className="text-gray-500">{val.type}</p> */}

              <div className="flex justify-between mt-4">
                <Link
                  to={`/products/edit/${val.ID}`}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => openModal(val)}
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="fixed bottom-10 right-10">
        <Link
          to="/create"
          className="inline-block px-4 py-4 text-lg font-bold bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          Add Menu
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedMenu && (
        <DeleteModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onConfirm={handleDelete}
          menuName={selectedMenu.name}
        />
      )}
    </div>
  );
}
