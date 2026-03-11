import React, { useState, useEffect } from "react";
import axios from "axios";

const RestaurantFoods = () => {

  const [foods, setFoods] = useState([]);

  const [name, setName] = useState("");
  const [halfPrice, setHalfPrice] = useState("");
  const [fullPrice, setFullPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingFood, setEditingFood] = useState(null);

  const token = localStorage.getItem("token");

  const fetchFoods = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/food/my-foods",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setFoods(res.data.foods);

    } catch (error) {
      console.error(error);
    }

  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const toggleAvailability = async (food) => {

    try {

      await axios.put(
        `http://localhost:5000/api/food/${food._id}`,
        { isAvailable: !food.isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchFoods();

    } catch (error) {

      console.error(error);

    }

  };

  const handleEdit = (food) => {

    setEditingFood(food);

    setName(food.name);
    setHalfPrice(food.halfPrice);
    setFullPrice(food.fullPrice);
    setDesc(food.description);
    setCategory(food.category);
    setPrepTime(food.prepTime);
    setIsAvailable(food.isAvailable);

    setShowForm(true);

  };

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this food item?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/api/food/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchFoods();

    } catch (error) {

      console.error(error);

    }

  };

  const resetForm = () => {

    setName("");
    setHalfPrice("");
    setFullPrice("");
    setDesc("");
    setCategory("");
    setPrepTime("");
    setIsAvailable(true);
    setImage(null);
    setPreview(null);
    setEditingFood(null);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingFood) {

        await axios.put(
          `http://localhost:5000/api/food/${editingFood._id}`,
          {
            name,
            halfPrice,
            fullPrice,
            description: desc,
            category,
            prepTime,
            isAvailable
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Food updated");

      } else {

        const formData = new FormData();

        formData.append("name", name);
        formData.append("halfPrice", halfPrice);
        formData.append("fullPrice", fullPrice);
        formData.append("description", desc);
        formData.append("category", category);
        formData.append("prepTime", prepTime);
        formData.append("isAvailable", isAvailable);
        formData.append("image", image);

        await axios.post(
          "http://localhost:5000/api/food/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Food added");

      }

      setShowForm(false);
      resetForm();
      fetchFoods();

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <div className="p-6 dark:text-gray-200">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-3xl font-bold">
          Restaurant Menu
        </h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg"
        >
          + Add Food
        </button>

      </div>


      {/* ADD / EDIT FOOD MODAL */}

      {showForm && (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

          <div className="relative bg-white dark:bg-gray-900 border
          dark:border-gray-700 rounded-xl p-6 w-[500px] shadow-xl
          max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="absolute top-3 right-4 text-xl font-bold"
            >
              ×
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editingFood ? "Edit Food" : "Add Food"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Food name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-3 rounded-lg"
                required
              />

              <div className="grid grid-cols-2 gap-3">

                <input
                  type="number"
                  placeholder="Half Price"
                  value={halfPrice}
                  onChange={(e) => setHalfPrice(e.target.value)}
                  className="border p-3 rounded-lg"
                  required
                />

                <input
                  type="number"
                  placeholder="Full Price"
                  value={fullPrice}
                  onChange={(e) => setFullPrice(e.target.value)}
                  className="border p-3 rounded-lg"
                  required
                />

              </div>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-3 rounded-lg"
                required
              >
                <option value="">Select Category</option>
                <option value="Starter">Starter</option>
                <option value="Main Course">Main Course</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverages">Beverages</option>
              </select>

              <input
                type="number"
                placeholder="Preparation Time (minutes)"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />

              <select
                value={isAvailable}
                onChange={(e) => setIsAvailable(e.target.value)}
                className="w-full border p-3 rounded-lg"
              >
                <option value={true}>Available</option>
                <option value={false}>Out of Stock</option>
              </select>

              <textarea
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full border p-3 rounded-lg"
              />

              {!editingFood && (

                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      setPreview(URL.createObjectURL(e.target.files[0]));
                    }}
                    required
                  />

                  {preview && (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </>

              )}

              <div className="flex gap-3">

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg"
                >
                  {editingFood ? "Update" : "Add"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* FOOD LIST */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {foods.map((food) => (

          <div
            key={food._id}
            className="bg-white dark:bg-gray-900 border
            dark:border-gray-700 shadow-lg rounded-2xl p-4"
          >

            <img
              src={`http://localhost:5000/uploads/${food.image}`}
              className="w-full h-40 object-cover rounded-lg mb-3"
              alt={food.name}
            />

            <h3 className="text-lg font-semibold">
              {food.name}
            </h3>

            <span className="inline-block bg-indigo-100
            text-indigo-700 text-xs px-2 py-1 rounded-full mt-1">

              {food.category}

            </span>

            <p className="text-green-600 font-medium mt-2">
              Half ₹{food.halfPrice} | Full ₹{food.fullPrice}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              ⏱ Prep Time: {food.prepTime} min
            </p>

            <p
              className={`text-sm mt-1 font-semibold ${
                food.isAvailable ? "text-green-600" : "text-red-500"
              }`}
            >
              {food.isAvailable ? "Available" : "Inactive"}
            </p>

            <p className="text-sm text-gray-500 mt-2">
              {food.description}
            </p>

            <div className="flex gap-2 mt-4">

              <button
                onClick={() => handleEdit(food)}
                className="flex-1 bg-indigo-600 text-white py-1 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(food._id)}
                className="flex-1 bg-red-500 text-white py-1 rounded-lg"
              >
                Delete
              </button>

            </div>

            <button
              onClick={() => toggleAvailability(food)}
              className={`mt-3 w-full py-2 rounded-lg text-white font-semibold
              ${
                food.isAvailable
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-500 hover:bg-gray-600"
              }`}
            >
              {food.isAvailable ? "Active" : "Inactive"}
            </button>

          </div>

        ))}

      </div>

    </div>

  );

};

export default RestaurantFoods;