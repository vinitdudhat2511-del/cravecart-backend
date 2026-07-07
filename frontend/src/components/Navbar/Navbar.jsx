import React, { useContext, useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { assets } from "../../assets/frontend_assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    getTotalCartAmount,
    token,
    setToken,
    searchQuery,
    setSearchQuery,
    loyaltyPoints,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setDropdownOpen(false);
    toast.success("Logout Successfully");
    navigate("/");
  };

  const handleNavigate = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          home
        </Link>
        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
          menu
        </a>
        <a href="#app-download" onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>
          mobile-app
        </a>
        <a href="#footer" onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>
          contact us
        </a>
      </ul>
      <div className="navbar-right">
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark-theme" : "light")}
          style={{ border: "none", background: "transparent", fontSize: "20px", padding: "0" }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile" ref={dropdownRef}>
            <img
              src={assets.profile_icon}
              alt=""
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            <ul className={`nav-profile-dropdown ${dropdownOpen ? "open" : ""}`}>
              {loyaltyPoints > 0 && (
                <>
                  <li className="points-badge-item">
                    <span className="points-badge-icon">🏆</span>
                    <p className="points-badge-text">{loyaltyPoints} pts</p>
                  </li>
                  <hr />
                </>
              )}
              <li onClick={() => handleNavigate("/profile")}>
                <img src={assets.profile_icon} alt="" />
                <p>Profile</p>
              </li>
              <hr />
              <li onClick={() => handleNavigate("/myorders")}>
                <img src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={() => handleNavigate("/favorites")}>
                <p style={{ fontSize: "20px" }}>❤️</p>
                <p>Favorites</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
