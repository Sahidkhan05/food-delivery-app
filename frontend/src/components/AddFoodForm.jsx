import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const AddFoodForm = ({ restaurantId, onAddFood = () => {} }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const storedToken = localStorage.getItem("token");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !desc || !image) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", desc);
      formData.append("image", image);
      formData.append("restaurantId", restaurantId);

      const res = await axios.post("http://localhost:5000/api/food/add", formData, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onAddFood(res.data.food);
      alert("Food added successfully!");

      // Reset form
      setName('');
      setPrice('');
      setDesc('');
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error("Add food failed:", err.response?.data || err.message);
      alert("Failed to add food.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="max-w-md mx-auto p-4 bg-white dark:bg-gray-800 shadow rounded space-y-4 text-gray-900 dark:text-gray-100"
    >
      <h2 className="text-xl font-semibold text-center">Add New Food Item</h2>

      <input
        type="text"
        placeholder="Food Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
      />

      <input
        type="number"
        placeholder="Price ₹"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
      />

      <textarea
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        rows={3}
      />

      <div
        {...getRootProps()}
        className={`w-full p-4 border-2 border-dashed rounded cursor-pointer text-center ${
          isDragActive ? 'bg-gray-100 dark:bg-gray-600' : 'bg-gray-50 dark:bg-gray-700'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img src={preview} alt="Preview" className="h-40 mx-auto object-cover rounded" />
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Adding..." : "Add Food"}
      </button>
    </form>
  );
};

export default AddFoodForm;
