import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import Header from "../components/structure/Header";
import Swal from "sweetalert2";

function Create() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("type", type);
    formData.append("image", image);
    Axios.post("http://localhost:3001/menu/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    Swal.fire({
      title: "Created",
      text: `Create menu successfully.`,
      icon: "success",
      timer: 1200, // Auto-close after 3 seconds
      showConfirmButton: false,
    })
      .then((response) => {
        console.log(response.data);
        clearForm();
        navigate("/products");
      })
      .catch((error) => {
        console.error("There was an error uploading the image!", error);
      });
  };

  const clearForm = () => {
    setName("");
    setPrice("");
    setType("");
    setImage("");
  };

  return (
    <div className="">
      <div className="mt-4 px-72" style={{ width: "100%", height: "100%" }}>
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 md-6"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-4 font-bold text-xl">Create Menu</h1>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
            >
              Name :
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
            >
              Price :
            </label>
            <input
              type="text"
              placeholder="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
            >
              Type :
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="">Select Type</option>
              <option value="id_1">เมนูตำ</option>
              <option value="id_2">เมนูยำ</option>
              <option value="id_3">เมนูทอด</option>
              <option value="id_4">เมนูผัด</option>
              <option value="id_5">เมนูต้ม</option>
              <option value="id_6">เมนูย่าง</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 text-sm font-bold mb-2 text-left"
            >
              Image :
            </label>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4 flex justify-center space-x-5">
            <button
              type="button"
              onClick={clearForm}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
