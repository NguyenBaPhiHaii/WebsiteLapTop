const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next(new ErrorHander("No orders found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find().populate('user', 'name').sort({ createdAt: -1 });

  let totalAmount = 0;
  let deliveredAmount = 0;
  let undeliveredAmount = 0; // Tổng tiền chưa giao hàng

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
    if (order.orderStatus === 'Delivered') {
      deliveredAmount += order.totalPrice;
    } else {
      undeliveredAmount += order.totalPrice; // Tính tổng tiền chưa giao hàng
    }
  });

  const ordersWithUserName = orders.map(order => ({
    ...order._doc,
    userName: order.user.name,
    createdAt: order.createdAt,
  }));

  res.status(200).json({
    success: true,
    totalAmount,
    deliveredAmount,
    undeliveredAmount, // Gửi tổng tiền chưa giao hàng về client
    orders: ordersWithUserName,
  });
});


// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("No orders found with this Id", 404));
  }

  if (order.orderStatus === "Delivered!") {
    return next(new ErrorHander("You have delivered this order!", 400));
  }

  if (req.body.status === "Shipped") {
    // Lặp qua từng sản phẩm trong đơn hàng và cập nhật stock
    for (const o of order.orderItems) {
      await updateStock(o.product, o.quantity);
    }
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
    // Lặp qua từng sản phẩm trong đơn hàng và đặt stock về 0
    for (const o of order.orderItems) {
      await updateStock(o.product, 0);
    }
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.Stock = quantity;

  await product.save({ validateBeforeSave: false });
}


// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("No orders found with this Id", 404));
  }

  await order.deleteOne(); 

  res.status(200).json({
    success: true,
  });
});

