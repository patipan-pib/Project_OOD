import React from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";

Modal.setAppElement("#root"); // Set the app root element for accessibility

const DeleteModal = ({ isOpen, onRequestClose, onConfirm, menuName }) => {
  const handleDelete = async () => {
    try {
      await onConfirm(); // Call the onConfirm function to handle deletion logic
      // Show success popup after deletion
      Swal.fire({
        title: "Deleted!",
        text: `The menu "${menuName}" has been deleted successfully.`,
        icon: "success",
        timer: 1200, // Auto-close after 3 seconds
        showConfirmButton: false,
      }).then(() => {
        // Close the modal after showing the success message
        onRequestClose();
      });
    } catch (error) {
      console.error("Error deleting the menu:", error);
      // Optionally, you can handle errors here, such as showing an error popup
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Delete"
      className="modal"
      overlayClassName="overlay"
    >
      <h2 className="text-xl font-bold mb-4">ยืนยันการลบ</h2>
      <p>คุณแน่ใจหรือไม่ที่จะลบเมนู "{menuName}" นี้?</p>
      <div className="flex justify-end mt-6">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 px-4 rounded mr-2 hover:bg-red-600"
        >
          ลบ
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

export default DeleteModal;
