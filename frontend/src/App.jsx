import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import MyFavorites from "./pages/MyFavorites/MyFavorites";
import UserProfile from "./pages/UserProfile/UserProfile";
import FoodDetail from "./pages/FoodDetail/FoodDetail";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar is sticky — must be inside the width-constrained wrapper */}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/"          element={<Home />} />
          <Route path="/cart"      element={<Cart />} />
          <Route path="/order"     element={<PlaceOrder />} />
          <Route path="/verify"    element={<Verify />} />
          <Route path="/myorders"  element={<MyOrders />} />
          <Route path="/favorites" element={<MyFavorites />} />
          <Route path="/profile"   element={<UserProfile />} />
          <Route path="/food/:id"  element={<FoodDetail />} />
        </Routes>
      </div>

      {/* Footer is full-width outside the constrained .app */}
      <Footer />
    </>
  );
};

export default App;
