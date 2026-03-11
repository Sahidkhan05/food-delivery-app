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
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import OrderTracking from "./pages/OrderTracking";
import FeaturedRestaurants from "./components/FeaturedRestaurants";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>

          {/* ===== Public Layout (Navbar visible) ===== */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <HomaPage />
              </>
            }
          />

          <Route
            path="/signup/user"
            element={
              <>
                <Navbar />
                <UserSignupPage />
              </>
            }
          />

          <Route
            path="/signup/restaurant"
            element={
              <>
                <Navbar />
                <RestaurantSignup />
              </>
            }
          />

          <Route
            path="/signup/delivery"
            element={
              <>
                <Navbar />
                <DeliverySignup />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <LoginPage />
              </>
            }
          />

          <Route
            path="/restaurants"
            element={
              <>
                <Navbar />
                <Restaurants />
              </>
            }
          />

          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <CartPage />
              </>
            }
          />

          <Route
            path="/order-confirmation"
            element={
              <>
                <Navbar />
                <OrderConfirmation />
              </>
            }
          />

          <Route
            path="/restaurant/:restaurantId"
            element={
              <>
                <Navbar />
                <RestaurantMenu />
              </>
            }
          />

          {/* ===== Dashboard Layout (NO Navbar) ===== */}
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="/delivery-dashboard" element={<DeliveryDashboard />} />

          <Route
  path="/forgot-password"
  element={
    <>
      <Navbar />
      <ForgotPasswordPage />
    </>
  }
/>

<Route
  path="/reset-password/:token"
  element={<ResetPasswordPage />}
/>

<Route
  path="/track-orders"
  element={<OrderTracking />}
/>

<Route path="/featured-restaurants" element={<FeaturedRestaurants />} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;