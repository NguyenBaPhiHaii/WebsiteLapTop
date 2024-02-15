import React, { Fragment, useEffect, useState } from "react";
// import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getProductDetails,
  newReview,
} from "../../actions/productAction";
import { useParams } from "react-router-dom";
import ReviewCard from "./ReviewCard.js";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import { addItemsToCart } from "../../actions/cartAction";
import ArrowBackIcon from "@mui/icons-material/KeyboardArrowLeft";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { product, loading, error } = useSelector((state) => state.productDetails);
  const { success, error: reviewError } = useSelector((state) => state.newReview);
  const [showImage, setShowImage] = useState(false);
  const [largeImage, setLargeImage] = useState('');


  const showLargeImage = (imageUrl) => {
    setLargeImage(imageUrl);
    setShowImage(true);
  };
  const options = {
    size: "large",
    value: product ? product.ratings : 0,
    readOnly: true,
    precision: 0.5,
  };

  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const increaseQuantity = () => {
    if (product.Stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(id, quantity));
    alert.success("Item Added To Cart");
  };

  const submitReviewToggle = () => {
    setOpen(!open);
  };

  const reviewSubmitHandler = () => {
    const myForm = new FormData();

    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(newReview(myForm));

    setOpen(false);
    setRating(0); 
    setComment(""); 
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      alert.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Review Submitted Successfully");
      dispatch({ type: NEW_REVIEW_RESET });
    }
    dispatch(getProductDetails(id));
  }, [dispatch, id, error, alert, reviewError, success]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} -- FSHOP`} />
          <div className="ProductDetails">
            <Link className="logo" to="/products">
              <ArrowBackIcon
                className="custom-arrow-back-icon"
                style={{ fontSize: "40px" }}
              />
            </Link>
            <div className="div1">
              {/* <Carousel> */}
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                      onClick={() => showLargeImage(item.url)} // Thêm sự kiện onClick
                    />
                  ))}
              {/* </Carousel> */}
            </div>
            <Dialog style={{borderRadius:"20px"}} open={showImage} onClose={() => setShowImage(false)}>
              <DialogTitle style={{textAlign:"center"}}>{product.name}</DialogTitle>
              <DialogContent>
                <img src={largeImage} alt="Large Slide" style={{width:"70%", marginLeft:"5rem"}} className="largeImage" />
              </DialogContent>
              <DialogTitle style={{color:"red", marginBottom:"1rem"}}>{`$${product.price}`}</DialogTitle>
              <DialogTitle style={{fontFamily:"italic"}}>{product.description}</DialogTitle>
              <DialogActions>
                <Button onClick={() => setShowImage(false)} color="primary">
                  Close
                </Button>
              </DialogActions>
            </Dialog>
            <div className="div2">
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product ID: # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span className="detailsBlock-2-span">
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`$${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseQuantity}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseQuantity}>+</button>
                    </div>
                    {product.Stock > 0 ? (
                    <button onClick={addToCartHandler}>Add to Cart</button>
                    ) : (
                    <p className="outOfStockMessage" style={{color:"crimson"}}>Product out stock</p>
                    )}
                </div>
                <p>
                    Status:{" "}
                    <b
                    className={
                        product.Stock < 1 ? "redColor" : "greenColor"
                    }
                    >
                    {product.Stock < 1 ? " OutOfStock" : " InStock"}
                    </b>
                </p>
                </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button onClick={submitReviewToggle} className="submitReview">
                Reviews
              </button>
            </div>
          </div>
          <h3 className="reviewsHeading">REVIEWS</h3>

          <Dialog
            aria-labelledby="simple-dialog-title"
            open={open}
            onClose={submitReviewToggle}
          >
            <DialogTitle>Submit Review</DialogTitle>
            <DialogContent className="submitDialog">
              <Rating
                name="rating"
                onChange={(e) => setRating(Number(e.target.value))}
                value={rating}
                size="large"
              />

              <textarea
                className="submitDialogTextArea"
                cols="30"
                rows="5"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </DialogContent>
            <DialogActions>
              <Button onClick={submitReviewToggle} color="secondary">
                Cancel
              </Button>
              <Button onClick={reviewSubmitHandler} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          <div className="reviews">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.slice().reverse().map((review) => (
                <ReviewCard
                  className="reviewCard"
                  key={review._id}
                  review={review}
                />
              ))
            ) : (
              <p className="noReviews">No Reviews Yet</p>
            )}
          </div>

          
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
