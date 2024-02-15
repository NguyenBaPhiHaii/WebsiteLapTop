import axios from "axios";
import { useSelector } from "react-redux";
import React from 'react';

const PayButton = ({ cartItems }) => {
    const { user } = useSelector((state) => state.user);

    const handleCheckout = async () => {
        try {
            console.log(cartItems);

            const response = await axios.post(
                "/api/v1/create-checkout-session",
                {
                    cartItems,
                    userID: user._id,
                }
            );

            // Kiểm tra phản hồi từ máy chủ
            if (response.data && response.data.url) {
                window.location.href = response.data.url;
            } else {
                alert("Không nhận được URL thanh toán từ máy chủ.");
            }

        } catch (error) {
            console.error("Lỗi trong quá trình thanh toán:", error);
        }
    };

    return (
        <>
            <button onClick={handleCheckout}>Check out</button>
        </>
    );
};

export default PayButton;
