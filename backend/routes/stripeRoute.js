const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);
const router = express.Router();

const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Route để tạo phiên thanh toán
router.post("/create-checkout-session", catchAsyncErrors(async (req, res) => {
  try {
    const { cartItems, userID } = req.body;

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/order/confirm`,
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Lỗi khi tạo phiên thanh toán:", error);
    res.status(500).send({ error: "Lỗi khi tạo phiên thanh toán" });
  }
}));

// Route để cập nhật đơn hàng sau thanh toán thành công
router.post("/update-order-after-payment", catchAsyncErrors(async (req, res) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!req.user) {
      return res.status(400).json({ error: "Người dùng không xác thực" });
    }

    const orderItems = session.display_items.map((item) => ({
      name: item.custom.name,
      price: item.amount / 100,
      quantity: item.quantity,
      image: item.custom.images[0],
      product: item.custom.product_id,
    }));

    const orderTotal = session.amount_total / 100;

    const order = await Order.create({
      shippingInfo: {  // Lấy thông tin vận chuyển từ phiên thanh toán Stripe nếu có
        address: session.shipping?.address?.line1 || "",
        city: session.shipping?.address?.city || "",
        state: session.shipping?.address?.state || "",
        country: session.shipping?.address?.country || "",
        pinCode: session.shipping?.address?.postal_code || "",
        phoneNo: session.shipping?.address?.phone || "",
      },
      orderItems,
      paymentInfo: {
        id: session.payment_intent,
        status: "succeeded",
      },
      itemsPrice: session.amount_subtotal / 100,
      taxPrice: (session.amount_total - session.amount_subtotal) / 100,
      shippingPrice: 0,
      totalPrice: orderTotal,
      paidAt: Date.now(),
      user: req.user._id,
    });

    for (let item of orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock -= item.quantity;
        product.sold += item.quantity;

        await product.save({ validateBeforeSave: false });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng sau thanh toán:", error);
    res.status(500).send({ error: "Lỗi khi cập nhật đơn hàng sau thanh toán" });
  }
}));

module.exports = router;
