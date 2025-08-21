// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userAddress, setUserAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("COD");

  const addToCart = (item) => {
    const exists = cartItems.find((i) => i._id === item._id);
    if (exists) {
      setCartItems(
        cartItems.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };

  const increaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(
      cartItems.map((item) => {
        if (item._id === itemId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider
     value={{
  cartItems,
  setCartItems, // ← isko yaha add karo
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  userAddress,
  setUserAddress,
  paymentMode,
  setPaymentMode,
}}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export { CartContext };
