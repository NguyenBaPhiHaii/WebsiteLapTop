const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("cloudinary");



// Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
  
    const {name, email, password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res);

});

 // Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
  
    // checking if user has given password and email both
  
    if (!email || !password) {
      return next(new ErrorHander("Vui lòng nhập Email và mật khẩu", 400));
    }
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) {
      return next(new ErrorHander("Email hoặc mật khẩu không hợp lệ", 401));
    }
  
    const isPasswordMatched = await user.comparePassword(password);
  
    if (!isPasswordMatched) {
      return next(new ErrorHander("Email hoặc mật khẩu không hợp lệ", 401));
    }

    sendToken(user, 200, res);
  });

// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Đã đăng xuất",
  });
});

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("Không tìm thấy người dùng", 404));
  }

  // Get Reset Password Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Mã thông báo đặt lại mật khẩu của bạn là: \n\n${resetPasswordUrl}\n\n .Nếu bạn chưa yêu cầu email này, vui lòng bỏ qua nó.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Khôi phục mật khẩu FShop`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Thư điện tử đã được gửi đến ${user.email} thành công`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Mã thông báo đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Mật khẩu không phải mật khẩu", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Get User Detail
// exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.user.id);

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// Get User Detail
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  try {
    // Kiểm tra xem req.user có tồn tại không
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const user = await User.findById(req.user.id);

    // Kiểm tra xem user có tồn tại không
    if (!user) {
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    // Trả về một phản hồi chung nếu có lỗi
    console.error('An error occurred:', error.message);
    res.status(500).json({
      success: false,
    });
  }
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Mật khẩu cũ không đúng", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("Mật khẩu không hợp lệ", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  // Kiểm tra xem cả name và email có được cung cấp không
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng nhập cả name và email.',
    });
  }

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});


// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`Người dùng không tồn tại với Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`Người dùng không tồn tại với Id: ${req.params.id}`, 400)
    );
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await User.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "USER DELETED SUCCESSFULLY !",
  });
});


