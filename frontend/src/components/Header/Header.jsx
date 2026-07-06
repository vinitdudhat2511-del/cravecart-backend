import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2>
          Order your favourite<br />
          <span>food here</span>
        </h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients. Our mission is to satisfy your
          cravings and elevate your dining experience — one delicious meal at a time.
        </p>
        <a href="#explore-menu">
          <button>View Menu ↓</button>
        </a>
      </div>
      <div className="header-scroll-hint">Scroll</div>
    </div>
  );
};

export default Header;
