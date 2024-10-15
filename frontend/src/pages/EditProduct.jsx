import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getMenuById, updateMenu } from "../API/Menu";
import Swal from "sweetalert2";
import { MenuContext } from "../contexts/MenuContext";

export default function EditProduct() {
  const { refreshMenu } = useContext(MenuContext);
  const { id } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate(); // For navigation after saving

  // Keep track of both current and original product data
  const [product, setProduct] = useState({
    name: "",
    price: "",
    type: "",
    image: "",
  });
  

  const [originalProduct, setOriginalProduct] = useState({}); // To store original product data
  const [isLoading, setIsLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await getMenuById(id);
        setProduct(response.data);
        setOriginalProduct(response.data); // Save the original product data
        setError(null);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching the product:", error);
        setError("ไม่สามารถดึงข้อมูลสินค้านี้ได้ กรุณาลองใหม่อีกครั้ง.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct((prevProduct) => ({ ...prevProduct, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(originalProduct)
    console.log(product)

    const formData = new FormData();
    // Append only changed fields to formData
    if (product.name !== originalProduct.name) {
      formData.append('name', product.name);
    } else {
      formData.append('name', originalProduct.name);
    }
    if (product.price !== originalProduct.price) {
      formData.append('price', product.price);
    } else {
      formData.append('price', originalProduct.price);
    }
    if (product.type !== originalProduct.type) {
      formData.append('type', product.type);
    } else {
      formData.append('type', originalProduct.type);
    }
    if (product.image && product.image instanceof File) {
      formData.append('image', product.image); // Add image only if changed
    } 
    // Check if there's anything to update
    if (formData.has('name') || formData.has('price') || formData.has('type') || formData.has('image')) {
      try {
        await updateMenu(id, formData);
        Swal.fire({
          title: "Success",
          text: "Product updated successfully!",
          icon: "success",
          timer: 1200,
          showConfirmButton: false,
        }).then(() => {
          refreshMenu()
          navigate("/products");
        });
      } catch (error) {
        console.error("Error updating product:", error.response ? error.response.data : error.message);
        setError("ไม่สามารถอัพเดตสินค้านี้ได้ กรุณาลองใหม่อีกครั้ง.");
      }
    } else {
      console.log("No changes made.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Menu Item</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Name field */}
          <div className="mb-4">
            <label className="block text-lg font-semibold" htmlFor="name">
              Current Name: {originalProduct.name}
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter new name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Price field */}
          <div className="mb-4">
            <label className="block text-lg font-semibold" htmlFor="price">
              Price : {originalProduct.price}
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Type field */}
          <div className="mb-4">
            <label className="block text-lg font-semibold" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={product.type}
              onChange={handleChange}
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

          {/* Current Image */}
          <div className="mb-4">
            <label className="block text-lg font-semibold" htmlFor="currentImage">
              Current Image
            </label>
            {product.image && typeof product.image === 'string' ? (
              <img
                src={`http://localhost:3001${product.image}`}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
            ) : (
              <p>No image available.</p>
            )}
          </div>

          {/* Upload New Image */}
          <div className="mb-4">
            <label className="block text-lg font-semibold" htmlFor="image">
              Upload New Image (optional)
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Submit and Cancel buttons */}
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Save Changes
          </button>
          <Link
            to="/products"
            className="ml-4 bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </Link>
        </form>
      )}
    </div>
  );
}
