import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomaPage from "./pages/HomaPage";
import UserSignupPage from "./pages/UserSignupPage";
import RestaurantSignup from "./pages/RestaurantSignup";
import DeliverySignup from "./pages/DeliverySignup";
import LoginPage from "./pages/LoginPage";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./admin/AdminRoute";
import Restaurants from "./pages/Restaurants";
import CartPage from "./pages/CartPage";
import { CartProvider } from "./context/CartContext";
import OrderConfirmation from "./pages/OrderConfirmation";
import DeliveryDashboard from "./pages/DeliveryDashboard";
import RestaurantMenu from "./pages/RestaurantMenu";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
       
        <div >
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomaPage />} />
              <Route path="/signup/user" element={<UserSignupPage />} />
              <Route path="/signup/restaurant" element={<RestaurantSignup />} />
              <Route path="/signup/delivery" element={<DeliverySignup />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
              <Route path="/admin-dashboard" element={<AdminRoute><AdminDashboard/></AdminRoute>} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />
              <Route path="/restaurant/:restaurantId" element={<RestaurantMenu />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
