import React, { useState, useEffect } from 'react';
import AddFoodForm from '../components/AddFoodForm';
import axios from 'axios';

const AddFoodList = () => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [foods, setFoods] = useState([]);
  const storedToken = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      if (user.role === "restaurant") {
        setRestaurantId(user._id);

        axios
          .get("http://localhost:5000/api/food/my-foods", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
          .then((res) => {
            const responseFoods = res.data.foods;

            if (Array.isArray(responseFoods)) {
              setFoods(responseFoods);
            } else if (Array.isArray(res.data)) {
              setFoods(res.data);
            } else {
              console.error("Invalid response: expected array but got", res.data);
              setFoods([]);
            }
          })
          .catch((err) => {
            console.error("Failed to fetch foods:", err.message);
            setFoods([]);
          });
      }
    }
  }, [storedToken]);

  const handleAddFood = (newFood) => {
    setFoods((prevFoods) => [...prevFoods, newFood]);
  };

  const handleDelete = async (foodId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this food?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/food/${foodId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setFoods((prevFoods) => prevFoods.filter((f) => f._id !== foodId));
    } catch (error) {
      console.error("Delete failed:", error.message);
      alert("Failed to delete food.");
    }
  };

  const handleEdit = async (food) => {
    const newName = prompt("Enter new name", food.name);
    const newPrice = prompt("Enter new price", food.price);
    const newDesc = prompt("Enter new description", food.desc || food.description);

    if (!newName || !newPrice || !newDesc) {
      alert("Invalid input or cancelled.");
      return;
    }

    try {
      const updatedFood = {
        name: newName,
        price: newPrice,
        desc: newDesc,
      };

      const res = await axios.put(`http://localhost:5000/api/food/${food._id}`, updatedFood, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setFoods((prevFoods) =>
        prevFoods.map((f) => (f._id === food._id ? res.data.food : f))
      );

      alert("Food updated successfully");
    } catch (error) {
      console.error("Edit failed:", error.message);
      alert("Failed to update food.");
    }
  };

  if (!restaurantId) {
    return <div className="p-6 text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <div className="p-6 text-gray-900 dark:text-gray-100">
      <AddFoodForm restaurantId={restaurantId} onAddFood={handleAddFood} />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Foods</h2>
        {!Array.isArray(foods) || foods.length === 0 ? (
          <p>No foods added yet.</p>
        ) : (
          <ul className="space-y-4">
            {foods.map((food) => (
              <li
                key={food._id}
                className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
              >
                <h3 className="text-lg font-semibold">{food.name}</h3>
                <p className="text-gray-700 dark:text-gray-300 mt-1">Price: ₹{food.price}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{food.desc || food.description}</p>
                {food.image && (
                  <img
                    src={`http://localhost:5000/uploads/${food.image}`}
                    alt={food.name}
                    className="mt-2 h-32 w-32 object-cover rounded border"
                  />
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(food)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddFoodList;
