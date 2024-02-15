const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  // Kiểm tra nếu không có token thì không làm gì và chuyển tiếp sang middleware tiếp theo
  if (!token) {
    return next();
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
  } catch (error) {
    return next(new ErrorHander("Mã thông báo không hợp lệ, vui lòng đăng nhập lại", 401));
  }
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ErrorHander(
          `Vai trò: ${req.user ? req.user.role : "undefined"} không được phép truy cập tài nguyên này`,
          403
        )
      );
    }

    next();
  };
};
