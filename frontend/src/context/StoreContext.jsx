import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = import.meta.env.VITE_API_URL || "https://cravecart-backend-wh1i.onrender.com";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      const response = await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
      if (!response.data.success) {
        toast.error("Something went wrong");
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      const response = await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
      if (!response.data.success) {
        toast.error("Something went wrong");
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    if (response.data.success) {
      setFoodList(response.data.data);
    } else {
      alert("Error! Products are not fetching..");
    }
  };

  const loadCardData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  const loadFavorites = async (token) => {
    const response = await axios.post(
      url + "/api/user/favorite/get",
      {},
      { headers: { token } }
    );
    if (response.data.success) {
      setFavorites(response.data.favorites);
    }
  };

  const loadLoyaltyPoints = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/user/points",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setLoyaltyPoints(response.data.loyaltyPoints);
      }
    } catch {
      // silently fail — points are non-critical
    }
  };

  const addFavorite = async (itemId) => {
    if (!favorites.includes(itemId)) {
      setFavorites((prev) => [...prev, itemId]);
    }
    if (token) {
      await axios.post(
        url + "/api/user/favorite/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFavorite = async (itemId) => {
    setFavorites((prev) => prev.filter((id) => id !== itemId));
    if (token) {
      await axios.post(
        url + "/api/user/favorite/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const applyPromo = async (code) => {
    try {
      const response = await axios.post(url + "/api/promo/validate", { code });
      if (response.data.success) {
        setDiscountPercent(response.data.discountPercent);
        toast.success(`Promo applied! ${response.data.discountPercent}% off`);
      } else {
        setDiscountPercent(0);
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error validating promo");
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCardData(localStorage.getItem("token"));
        await loadFavorites(localStorage.getItem("token"));
        await loadLoyaltyPoints(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    searchQuery,
    setSearchQuery,
    favorites,
    addFavorite,
    removeFavorite,
    discountPercent,
    setDiscountPercent,
    applyPromo,
    loyaltyPoints,
    setLoyaltyPoints,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
