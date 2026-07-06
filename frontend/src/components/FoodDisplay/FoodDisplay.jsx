import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category, dietTag }) => {
  const { food_list, searchQuery } = useContext(StoreContext);
  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          const matchCategory = category === "All" || category === item.category;
          const matchSearch =
            !searchQuery ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchTag =
            !dietTag || dietTag === "All" || (item.tags && item.tags.includes(dietTag));

          if (matchCategory && matchSearch && matchTag)
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                tags={item.tags || []}
              />
            );
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
