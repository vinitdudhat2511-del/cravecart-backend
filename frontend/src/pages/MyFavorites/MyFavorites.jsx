import React, { useContext } from "react";
import "./MyFavorites.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../../components/FoodItem/FoodItem";

const MyFavorites = () => {
  const { food_list, favorites } = useContext(StoreContext);

  const favoriteFoods = food_list.filter((item) => favorites.includes(item._id));

  return (
    <div className="my-favorites">
      <h2>My Favorites</h2>
      {favoriteFoods.length === 0 ? (
        <p>You have not added any favorites yet!</p>
      ) : (
        <div className="favorites-list">
          {favoriteFoods.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavorites;
