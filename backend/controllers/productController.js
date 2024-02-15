const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");




// Create Products -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

    req.body.user = req.user.id

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
})

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req,res,next)=>{

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter()
    .pagination(resultPerPage)
    const products = await apiFeatures.query.sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
    })
})

// Get All Product
// exports.getAllProductss = catchAsyncErrors(async (req,res,next)=>{

//   const resultPerPage = 8;
//   const productsCount = await Product.countDocuments();

//   const apiFeatures = new ApiFeatures(Product.find(),req.query)
//   .search()
//   .filter()
//   .pagination(resultPerPage)
//   const products =  await apiFeatures.query;

//   res.status(200).json({
//       success: true,
//       products,
//       productsCount,
//       resultPerPage,
//   })
// })

// Get All Product (ADMIN)
exports.getAdminProducts = catchAsyncErrors(async (req,res,next)=>{

  const products = await Product.find()

  res.status(200).json({
      success: true,
      products,
  })
})


// Get Product Details
exports.getProductDetails = catchAsyncErrors(async(req, res, next)=>{
    
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not available", 404));
    }

    res.status(200).json({
        success:true,
        product,
    })
})

//Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not available", 404));
  }

  let images = [];

  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product - Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not available", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
        success:true,
        message: "Product deletion successful"
    })

})

// REVIEIW
// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    createdAt: new Date(), // Thêm trường createdAt
  };

  const product = await Product.findById(productId);

  // Kiểm tra xem người dùng đã từng đánh giá sản phẩm trước đó chưa
  const existingReviewIndex = product.reviews.findIndex(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (existingReviewIndex !== -1) {
    // Nếu đã đánh giá trước đó, không thay thế đánh giá cũ
    // Thay vì việc thay thế, hãy thêm đánh giá mới vào mảng reviews của sản phẩm
    product.reviews.push(review);
  } else {
    // Nếu chưa đánh giá trước đó, thêm đánh giá mới vào mảng reviews của sản phẩm
    product.reviews.push(review);
  }

  // Tính toán điểm đánh giá trung bình của sản phẩm
  let avg = 0;
  for (let i = 0; i < product.reviews.length; i++) {
    avg += product.reviews[i].rating;
  }
  product.ratings = avg / product.reviews.length;

  // Cập nhật số lượng đánh giá
  product.numOfReviews = product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not available", 404));
  }

  // Sort reviews by createdAt field in descending order
  product.reviews.sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

  // Delete Review
  exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHandler("Product not available", 404));
    }
  
    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Product.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });
  