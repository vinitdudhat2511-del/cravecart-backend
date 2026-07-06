import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { toast } from "react-toastify";

const Verify = () => {
    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url, token, setLoyaltyPoints } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(url + "/api/order/verify", { success, orderId });
        if (response.data.success) {
            // Refresh loyalty points so Navbar/PlaceOrder reflect new balance immediately
            if (token) {
                try {
                    const pointsRes = await axios.post(
                        url + "/api/user/points",
                        {},
                        { headers: { token } }
                    );
                    if (pointsRes.data.success) {
                        setLoyaltyPoints(pointsRes.data.loyaltyPoints);
                    }
                } catch {
                    // non-critical — ignore
                }
            }
            toast.success("🎉 Order placed! Points credited to your account.");
            navigate("/myorders");
        } else {
            toast.error("Payment was not completed");
            navigate("/");
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [])

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify
