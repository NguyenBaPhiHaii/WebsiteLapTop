/* global createOrder */
import React, { Fragment } from "react";
import CheckoutSteps from "../Cart/CheckoutSteps";
import { useSelector } from "react-redux";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import gif from '../../images/payment.gif.gif';
import Payments from '../User/Payments'

const Paypal = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

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
            cartItems,
            shippingInfo,
        };
    
        createOrder(data);
        navigate("/paypal");
    };
    
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
          <img style={{ width: '7rem' }} src={gif} alt='gif' className='w-48' />
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

            <Payments/>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Paypal;
