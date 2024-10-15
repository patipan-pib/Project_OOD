import React from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";

Modal.setAppElement("#root"); // Set the app root element for accessibility

const CreateBillModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  menuList,
  total,
}) => {
  const handleSave = async () => {
    try {
      await onConfirm();
      // Swal.fire({
      //   title: "Saved!",
      //   text: "Bill saved successfully.",
      //   icon: "success",
      //   timer: 1200,
      //   showConfirmButton: false,
      // }).then(() => {
      //   onRequestClose();
      // });
    } catch (error) {
      console.error("Error saving the bill:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to save the bill. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handlePrint = () => {
    // Implement your print logic here
    console.log("Print functionality needs to be implemented.");
    Swal.fire({
      title: "Print!",
      icon: "question",
      text: "Print functionality is not implemented yet.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Create Bill"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-bold mb-4">สร้างใบเสร็จชำระเงิน</h2>
      <div>
        {menuList.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <p className="flex-1">
              {item.quantity} {item.name}
            </p>
            <p>
              {item.price.toLocaleString("th-TH", {
                style: "currency",
                currency: "THB",
              })}
            </p>
          </div>
        ))}
        <hr />
        <p className="flex justify-end font-bold">
          Total:{" "}
          {total.toLocaleString("th-TH", {
            style: "currency",
            currency: "THB",
          })}
        </p>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-600"
        >
          Print
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white py-2 px-4 rounded mr-2 hover:bg-green-600"
        >
          บันทึก
        </button>
        <button
          onClick={onRequestClose}
          className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
        >
          ยกเลิก
        </button>
      </div>
    </Modal>
  );
};

export default CreateBillModal;
