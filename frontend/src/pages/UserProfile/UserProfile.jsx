import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./UserProfile.css";

const UserProfile = () => {
  const { url, token } = useContext(StoreContext);
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    address: { street: "", city: "", state: "", zipcode: "", country: "" },
  });

  const fetchProfile = async () => {
    if (token) {
      const response = await axios.post(url + "/api/user/profile/get", {}, { headers: { token } });
      if (response.data.success) {
        setProfileData({
          name: response.data.user.name || "",
          phone: response.data.user.phone || "",
          address: response.data.user.address || { street: "", city: "", state: "", zipcode: "", country: "" },
        });
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (["street", "city", "state", "zipcode", "country"].includes(name)) {
      setProfileData((prev) => ({ ...prev, address: { ...prev.address, [name]: value } }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(url + "/api/user/profile/update", profileData, { headers: { token } });
      if (response.data.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Error updating profile.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  return (
    <div className="user-profile">
      <h2>My Profile</h2>
      <form onSubmit={updateProfile} className="profile-form">
        <label>Full Name</label>
        <input type="text" name="name" value={profileData.name} onChange={onChangeHandler} required />

        <label>Phone Number</label>
        <input type="text" name="phone" value={profileData.phone} onChange={onChangeHandler} />

        <h3>Default Delivery Address</h3>
        <label>Street</label>
        <input type="text" name="street" value={profileData.address.street} onChange={onChangeHandler} />

        <div className="multi-fields">
          <div>
            <label>City</label>
            <input type="text" name="city" value={profileData.address.city} onChange={onChangeHandler} />
          </div>
          <div>
            <label>State</label>
            <input type="text" name="state" value={profileData.address.state} onChange={onChangeHandler} />
          </div>
        </div>

        <div className="multi-fields">
          <div>
            <label>Zip Code</label>
            <input type="text" name="zipcode" value={profileData.address.zipcode} onChange={onChangeHandler} />
          </div>
          <div>
            <label>Country</label>
            <input type="text" name="country" value={profileData.address.country} onChange={onChangeHandler} />
          </div>
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default UserProfile;
