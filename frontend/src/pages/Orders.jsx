// src/pages/Order.js
import React, { useEffect, useState } from 'react';
import { getUnpaidBills, payBill, cancelBill, editBill } from '../API/Bill';
import { TailSpin } from 'react-loader-spinner';
import Swal from 'sweetalert2';
import { FcPaid, FcCancel, FcDocument, FcEditImage } from 'react-icons/fc';
import EditBillModal from '../components/structure/EditBillModal';

export default function Order() {
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const fetchUnpaidBills = async () => {
    setIsLoading(true);
    try {
      const data = await getUnpaidBills();
      setBills(data);
      setError(null);
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลบิลได้');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnpaidBills();
  }, []);

  const handlePay = async (billId) => {
    try {
      await payBill(billId);
      Swal.fire({
        title: 'ชำระเงินสำเร็จ!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchUnpaidBills();
    } catch (err) {
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถชำระเงินได้ กรุณาลองใหม่',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCancel = async (billId) => {
    const result = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: 'ต้องการยกเลิกบิลนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่',
    });

    if (result.isConfirmed) {
      try {
        await cancelBill(billId);
        Swal.fire({
          title: 'ยกเลิกบิลเรียบร้อย!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
        fetchUnpaidBills();
      } catch (err) {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถยกเลิกบิลได้ กรุณาลองใหม่',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    }
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedBill(null);
  };

  const handleEditSubmit = async (updatedBillData) => {
    try {
      await editBill(selectedBill.ID, updatedBillData);
      Swal.fire({
        title: 'แก้ไขบิลสำเร็จ!',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      closeEditModal();
      fetchUnpaidBills();
    } catch (error) {
      console.error("Error editing bill:", error);
      Swal.fire({
        title: 'เกิดข้อผิดพลาด!',
        text: 'ไม่สามารถแก้ไขบิลได้ กรุณาลองใหม่',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">รายการบิลที่ยังไม่ได้ชำระเงิน</h1>
      
      <button
        onClick={fetchUnpaidBills}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        รีเฟรชข้อมูล
      </button>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <TailSpin height="80" width="80" color="#00BFFF" ariaLabel="loading" />
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : bills.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <FcDocument className="opacity-50" style={{ fontSize: '10rem' }} />
          <p className="text-gray-500 mt-4">ไม่มีบิลที่ยังไม่ได้ชำระเงิน</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">หมายเลขบิล</th>
                <th className="py-2 px-4 border-b">โต๊ะ</th>
                <th className="py-2 px-4 border-b">รายการอาหาร</th>
                <th className="py-2 px-4 border-b">ราคารวม</th>
                <th className="py-2 px-4 border-b">วันที่สร้าง</th>
                <th className="py-2 px-4 border-b">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.ID} className="text-center">
                  <td className="py-2 px-4 border-b">{bill.ID}</td>
                  <td className="py-2 px-4 border-b">{bill.table_number}</td>
                  <td className="py-2 px-4 border-b">
                    {bill.bill_items && bill.bill_items.map((item, index) => (
                      <div key={index}>
                        {item.menu_name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {bill.total_price.toLocaleString('th-TH', {
                      style: 'currency',
                      currency: 'THB',
                    })}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(bill.created_at).toLocaleString('th-TH')}
                  </td>
                  <td className="py-2 px-4 border-b flex justify-center space-x-2">
                    <button
                      onClick={() => handlePay(bill.ID)}
                      className="flex items-center bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      aria-label={`ชำระเงินบิลหมายเลข ${bill.ID}`}
                    >
                      <FcPaid className="mr-1" /> ชำระเงิน
                    </button>
                    <button
                      onClick={() => handleCancel(bill.ID)}
                      className="flex items-center bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      aria-label={`ยกเลิกบิลหมายเลข ${bill.ID}`}
                    >
                      <FcCancel className="mr-1" /> ยกเลิก
                    </button>
                    <button
                      onClick={() => handleEdit(bill)}
                      className="flex items-center bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      aria-label={`แก้ไขบิลหมายเลข ${bill.ID}`}
                    >
                      <FcEditImage className="mr-1" /> แก้ไข
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal สำหรับแก้ไขบิล */}
      {selectedBill && (
        <EditBillModal
          isOpen={isEditModalOpen}
          onRequestClose={closeEditModal}
          onSubmit={handleEditSubmit}
          bill={selectedBill}
        />
      )}
    </div>
  );
}
