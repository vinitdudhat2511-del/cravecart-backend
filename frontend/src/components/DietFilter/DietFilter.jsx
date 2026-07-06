import React from "react";
import "./DietFilter.css";

const DIET_TAGS = [
  { label: "All",        emoji: "🍽️" },
  { label: "Vegan",      emoji: "🌱" },
  { label: "Spicy",      emoji: "🌶️" },
  { label: "Gluten-Free",emoji: "🌾" },
  { label: "Best Seller",emoji: "⭐" },
  { label: "New",        emoji: "🆕" },
];

const DietFilter = ({ dietTag, setDietTag }) => {
  return (
    <div className="diet-filter">
      <p className="diet-filter-title">Filter by:</p>
      <div className="diet-pills">
        {DIET_TAGS.map((tag) => (
          <button
            key={tag.label}
            className={`diet-pill ${dietTag === tag.label ? "active" : ""}`}
            onClick={() => setDietTag(tag.label)}
          >
            <span>{tag.emoji}</span>
            <span>{tag.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DietFilter;
