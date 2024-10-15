import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { createBill } from "../API/Bill";
import Card from "../components/share/Card";
import CardSum from "../components/share/CardSum";
import { FcFeedIn, FcFilledFilter, FcDeleteDatabase } from "react-icons/fc";
import { TailSpin } from "react-loader-spinner";
import CreateBillModal from "../components/structure/CreateBillModal";
import Swal from "sweetalert2";
import { MenuContext } from "../contexts/MenuContext";
import useLocalStorage from "../hooks/useLocalStorage"; 

export default function Home() {
  const {
    menuList,
    isLoading,
    error,
    refreshMenu
  } = useContext(MenuContext);
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [selectionCounts, setSelectionCounts] = useLocalStorage("selectionCounts", {});

  // ฟิลเตอร์เมนูตามค้นหาและประเภท
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
      .filter(
        (item) => (typeFilter ? item.type === typeFilter : true) // กรองตาม type
      )
      .sort((a, b) => {
        const countA = selectionCounts[a.ID] || 0;
        const countB = selectionCounts[b.ID] || 0;
        return countB - countA; // เรียงจากมากไปน้อย
      });
  }, [menuList, searchQuery, categoryFilter, typeFilter, selectionCounts]);

  const handleCardClick = useCallback((item) => {
    setSelectedItems((prevItems) => {
      const existingItem = prevItems.find(
        (selected) => selected.ID === item.ID
      );
      if (existingItem) {
        return prevItems.map((selected) =>
          selected.ID === item.ID
            ? { ...selected, quantity: selected.quantity + 1 }
            : selected
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const isItemSelected = (id) => {
    const item = selectedItems.find((selected) => selected.ID === id);
    return item
      ? { isSelected: true, quantity: item.quantity }
      : { isSelected: false, quantity: 0 };
  };

  const handleIncrease = useCallback((index) => {
    setSelectedItems((prevItems) => {
      const updatedItems = prevItems.map((selected, i) =>
        i === index
          ? { ...selected, quantity: selected.quantity + 1 }
          : selected
      );
      return updatedItems.sort((a, b) => b.quantity - a.quantity);
    });
  }, []);

  const handleDecrease = useCallback((index) => {
    setSelectedItems((prevItems) => {
      let updatedItems = prevItems;
      const item = prevItems[index];
      if (item.quantity === 1) {
        updatedItems = prevItems.filter((_, i) => i !== index);
      } else {
        updatedItems = prevItems.map((selected, i) =>
          i === index
            ? { ...selected, quantity: selected.quantity - 1 }
            : selected
        );
      }
      return updatedItems.sort((a, b) => b.quantity - a.quantity);
    });
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setSelectedItems((prevItems) => prevItems.filter((_, i) => i !== index));
  }, []);

  const handlePriceChange = useCallback((index, newPrice) => {
    const sanitizedPrice = newPrice === "" ? 0 : Number(newPrice);
    setSelectedItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, price: sanitizedPrice } : item
      )
    );
  }, []);

  const openModal = () => {
    if (selectedItems.length === 0) {
      // แก้เงื่อนไขตรวจสอบจำนวนเมนู
      Swal.fire({
        title: "กรุณาเลือกเมนู!",
        icon: "warning",
        timer: 1200,
        showConfirmButton: false,
      });
    } else if (!selectedTable) {
      Swal.fire({
        title: "กรุณาเลือกโต๊ะ!",
        icon: "warning",
        timer: 1200,
        showConfirmButton: false,
      });
    } else {
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const billData = {
        items: selectedItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        Status: 'unpaid',
        tableNumber: selectedTable,
        totalPrice: totalPrice,
      };

      console.log(billData);

      const response = await createBill(billData);

      setSelectionCounts((prevCounts) => {
        const updatedCounts = { ...prevCounts };
        selectedItems.forEach((item) => {
          updatedCounts[item.ID] =
            (updatedCounts[item.ID] || 0) + item.quantity;
        });
        return updatedCounts;
      });

      Swal.fire({
        title: "บันทึกเรียบร้อย!",
        text: "บิลถูกบันทึกสำเร็จแล้ว",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        setSelectedTable("");
        setSelectedItems([]);
        setIsModalOpen(false);
      });

      console.log("Bill created with ID:", response.billId);
    } catch (error) {
      console.error("Error confirming bill:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: "ไม่สามารถบันทึกบิลได้ กรุณาลองใหม่",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    const total = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
  }, [selectedItems]);

  return (
    <div>
      <div className="flex mt-4 h-[88vh]">
        {/* ส่วนเมนู */}
        <div className="flex flex-col w-4/5 p-4">
          {/* ค้นหาและกรอง */}
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
                <option value="">ทั้งหมด</option>
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
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 mb-4 rounded w-5/6"
              aria-label="Search Menu Items"
            />
          </div>

          {/* แสดงเมนูในรูปแบบกริด */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-auto">
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
              <div className="flex flex-col justify-center items-center h-[60vh] w-[70vw]">
                <FcDeleteDatabase
                  className="opacity-50"
                  style={{ fontSize: "10rem" }}
                />
                <p className="text-gray-500 mt-4 text-lg">ไม่พบรายการ</p>
              </div>
            ) : (
              filteredMenu.map((val) => {
                const { isSelected, quantity } = isItemSelected(val.ID);
                return (
                  <Card
                    key={val.ID} // ใช้ ID เป็น key
                    index={val.ID}
                    name={val.name}
                    price={val.price}
                    imgsrc={`http://localhost:3001${val.image}`}
                    onClick={() =>
                      selectedTable
                        ? handleCardClick(val)
                        : Swal.fire({
                            title: "กรุณาเลือกโต๊ะ!",
                            icon: "warning",
                            confirmButtonText: "OK",
                          })
                    }
                    isSelected={isSelected}
                    quantity={quantity}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* ส่วนแสดงรายการที่เลือก */}
        <section className="px-4 pt-4 w-1/5 h-[100%]">
          <div className="mb-4 overflow-y-scroll h-5/6">
            <span>
              <label htmlFor="select" className="mr-2 font-medium">
                Bill :
              </label>
              <select
                id="table"
                value={selectedTable}
                onChange={(e) => {
                  if (e.target.value.length === 0) setSelectedItems([]);
                  setSelectedTable(e.target.value);
                }}
                className="border p-2 rounded w-1/4 "
                aria-label="Select Table"
              >
                <option value="">Select</option>
                <option value="1">โต๊ะ 1</option>
                <option value="2">โต๊ะ 2</option>
                <option value="3">โต๊ะ 3</option>
                <option value="4">โต๊ะ 4</option>
                <option value="5">โต๊ะ 5</option>
                <option value="6">โต๊ะ 6</option>
                <option value="7">โต๊ะ 7</option>
                <option value="8">โต๊ะ 8</option>
                <option value="9">โต๊ะ 9</option>
                <option value="10">โต๊ะ 10</option>
                <option value="11">โต๊ะ 11</option>
                <option value="12">โต๊ะ 12</option>
              </select>
            </span>
            {selectedTable.length !== 0 && selectedItems.length > 0 ? (
              selectedItems.map((item, index) => (
                <CardSum
                  key={item.ID} // ใช้ ID เป็น key
                  item={item}
                  index={index}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemoveItem}
                  onPriceChange={handlePriceChange}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-5/6">
                <FcFeedIn
                  className="opacity-50"
                  style={{ fontSize: "120px" }}
                />
                <p className="text-gray-500 mt-4">
                  เลือกเมนูเพื่อเริ่มสั่งอาหาร
                </p>
              </div>
            )}
          </div>

          {/* แสดงราคารวมและปุ่มบันทึก */}
          <div>
            <div className="flex items-center mb-4">
              <label htmlFor="sumMenu" className="mr-2 pr-4 w-16">
                รวม :
              </label>
              <input
                id="sumMenu"
                type="text" // เปลี่ยนจาก 'number' เป็น 'text' เพื่อแสดงเป็นรูปแบบเงิน
                placeholder="0"
                value={totalPrice.toLocaleString("th-TH", {
                  style: "currency",
                  currency: "THB",
                })}
                readOnly
                className="text-center border-b-2 rounded p-1 w-full"
                aria-label="Total Price"
              />
            </div>

            <button
              type="button"
              className="text-center text-white font-bold w-full bg-green-600 hover:bg-green-700 transition-colors rounded p-2"
              onClick={openModal}
              aria-label="Proceed to Payment"
            >
              เสร็จสิ้น
            </button>
          </div>
        </section>

        {/* แสดง Modal สำหรับสร้างบิล */}
        <CreateBillModal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          onConfirm={handleConfirm}
          menuList={selectedItems}
          total={totalPrice}
        />
      </div>

      {/* Footer */}
    </div>
  );
}
