import React, { Fragment, useEffect, useState } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../../actions/orderAction";
import { useAlert } from "react-alert";

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  const createOrderState = useSelector((state) => state.createOrder);
  const loading = createOrderState?.loading;
  const success = createOrderState?.success;
  const error = createOrderState?.error;
  const alert = useAlert();
  const navigate = useNavigate();
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const tax = subtotal * 0.18;

  const totalPrice = subtotal + tax + shippingCharges;

  const address =
    shippingInfo &&
    `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.pinCode}, ${shippingInfo.country}`;

  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };

    sessionStorage.setItem("orderInfo", JSON.stringify(data));

    navigate("/process/payment");
  };

  const handleOfflinePayment = async () => {
    const order = {
      shippingInfo,
      orderItems: cartItems,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shippingCharges,
      totalPrice,
    };

    try {
      await dispatch(createOrder(order, true));

      if (!error) {
        alert.success("Your order has been created successfully!");
        navigate("/success");
      } else {
        alert.error(`An error occurred: ${error}`);
      }
    } catch (error) {
      console.error("Error during order creation:", error);
      alert.error("An error occurred during order processing.");
    }
  };

  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  const handlePaymentConfirmation = () => {
    setIsConfirmingPayment(true);
  };

  const confirmPayment = async () => {
    try {
      await handleOfflinePayment();
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  const cancelPayment = () => {
    setIsConfirmingPayment(false);
  };

  useEffect(() => {
    // Không có xử lý nội dung ở đây
  }, [success, navigate]);

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckoutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              {user && (
                <div>
                  <p>Name:</p>
                  <span>{user.name}</span>
                </div>
              )}
              {shippingInfo && (
                <div>
                  <p>Phone:</p>
                  <span>{shippingInfo.phoneNo}</span>
                </div>
              )}
              {address && (
                <div>
                  <p>Address:</p>
                  <span>{address}</span>
                </div>
              )}
            </div>
          </div>
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {Array.isArray(cartItems) && cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>{" "}
                    <span>
                      {item.quantity} X ${item.price} ={" "}
                      <b>${item.price * item.quantity}</b>
                    </span>
                  </div>
                ))
              ) : (
                <p>Your cart is empty</p>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>${subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>${shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>${tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>${totalPrice}</span>
            </div>

            <button onClick={proceedToPayment}>Payment Online</button>
            <button onClick={handlePaymentConfirmation} disabled={loading}>
              Payment Offline
            </button>

            {isConfirmingPayment && (
              <div>
                <div className="overlay"></div>
                <div className="confirmation-dialog">
                  <p className="confirm-h1">{`Are you sure you want to proceed with offline payment?`}</p>

                  <div className="btn-container">
                    <button onClick={cancelPayment} className="cancel-btn">
                      Cancel
                    </button>
                    <button onClick={confirmPayment} className="confirm-btn">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
