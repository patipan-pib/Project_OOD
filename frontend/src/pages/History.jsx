// src/pages/History.js
import React, { useEffect, useState } from "react";
import { getHistoryBills } from "../API/Bill";
import { TailSpin } from "react-loader-spinner";
import Swal from "sweetalert2";
import { FcDocument, FcPaid, FcCancel } from "react-icons/fc";

export default function History() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 10;

  const fetchHistoryBills = async () => {
    setIsLoading(true);
    try {
      const data = await getHistoryBills();
      setBills(data);
      setFilteredBills(data);
      setError(null);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลบิลประวัติได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryBills();
  }, []);

  useEffect(() => {
    let updatedBills = [...bills];

    // ค้นหาบิลตามหมายเลขบิลหรือโต๊ะ
    if (searchQuery.trim() !== "") {
      updatedBills = updatedBills.filter(
        (bill) =>
          bill.ID.toString().includes(searchQuery) ||
          bill.table_number.toString().includes(searchQuery)
      );
    }

    // กรองบิลตามสถานะ
    if (statusFilter !== "all") {
      updatedBills = updatedBills.filter(
        (bill) => bill.status === statusFilter
      );
    }

    setFilteredBills(updatedBills);
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อมีการกรอง
  }, [searchQuery, statusFilter, bills]);

  // คำนวณข้อมูลสำหรับแสดงในหน้าปัจจุบัน
  const indexOfLastBill = currentPage * billsPerPage;
  const indexOfFirstBill = indexOfLastBill - billsPerPage;
  const currentBills = filteredBills.slice(indexOfFirstBill, indexOfLastBill);

  const totalPages = Math.ceil(filteredBills.length / billsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ประวัติบิล</h1>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="ค้นหาบิล (หมายเลขบิลหรือโต๊ะ)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-1/3"
          aria-label="Search History Bills"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded w-1/4"
          aria-label="Filter by Status"
        >
          <option value="all">ทั้งหมด</option>
          <option value="paid">ชำระแล้ว</option>
          <option value="cancelled">ยกเลิก</option>
        </select>
        <button
          onClick={fetchHistoryBills}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          รีเฟรชข้อมูล
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <TailSpin
            height="80"
            width="80"
            color="#00BFFF"
            ariaLabel="loading"
          />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : filteredBills.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FcDocument className="opacity-50" style={{ fontSize: "10rem" }} />
          <p className="text-gray-500 mt-4">ไม่มีประวัติบิล</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">หมายเลขบิล</th>
                  <th className="py-2 px-4 border-b">โต๊ะ</th>
                  <th className="py-2 px-4 border-b">รายการอาหาร</th>
                  <th className="py-2 px-4 border-b">ราคารวม</th>
                  <th className="py-2 px-4 border-b">วันที่สร้าง</th>
                  <th className="py-2 px-4 border-b">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {currentBills.map((bill) => (
                  <tr key={bill.ID} className="text-center">
                    <td className="py-2 px-4 border-b">{bill.ID}</td>
                    <td className="py-2 px-4 border-b">{bill.table_number}</td>
                    <td className="py-2 px-4 border-b">
                      {bill.bill_items &&
                        bill.bill_items.map((item, index) => (
                          <div key={index}>
                            {item.menu_name} x {item.quantity}
                          </div>
                        ))}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {bill.total_price.toLocaleString("th-TH", {
                        style: "currency",
                        currency: "THB",
                      })}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(bill.created_at).toLocaleString("th-TH")}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {bill.status === "paid" ? (
                        <div className="flex items-center justify-center">
                          <FcPaid className="mr-1" /> ชำระแล้ว
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <FcCancel className="mr-1" /> ยกเลิก
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                aria-label={`Go to page ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
