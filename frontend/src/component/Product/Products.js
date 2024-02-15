import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "./ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";
import Slideshow from "./SlideShow";

const categories = [
  "ALL PRODUCTS",
  "Asus",
  "Dell",
  "HP",
  "MSI",
  "Lenovo",
  "Acer",
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 5000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const { products, loading, error, productsCount, resultPerPage } = useSelector(
    (state) => state.products
  );
  const { keyword } = useParams();

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  const handleCategoryClick = (cat) => {
    if (cat === "ALL PRODUCTS") {
      setCategory("");
    } else {
      setCategory(cat);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- FSHOP" />
          <div className="slideshow">
            <Slideshow />
          </div>
          {keyword && (
            <h2 style={{textAlign:"center", marginTop:'8px', color:"rgb(226 19 19 / 71%)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}} className="searchResultHeading">
              Sản phẩm dựa trên từ khóa: {keyword}
            </h2>
          )}
          <h2 className="productsHeading">Products</h2>
          <div className="products" id="products">
          {/* .map được sử dụng để lặp qua từng phần tử trong mảng products. */}
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          <div className="filterBox" style={{ marginTop: "33%" }}>
            <Typography style={{ fontSize: "20px", color: "green", margin: "20px 0px" }}>
              Price
            </Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={5000}
            />
            <Typography style={{ fontSize: "20px", color: "green", margin: "20px 0px" }}>
              Categories
            </Typography>
            <ul className="categoryBox">

            {/* map sử dụng để lặp qua từng phần tử trong mảng categories. */}
            {/* key={cat} được sử dụng để định danh mỗi phần tử trong danh sách. */}
              {categories.map((cat) => (
                <li
                  style={{ margin: "15px 0px" }}
                  className={`category-link ${category === cat ? "active" : ""}`}
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                >
                  <hr style={{ width: "100%" }} />
                  {cat}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend" style={{ fontSize: "19px", color: "green", margin: "20px 0px" }}>
                Star Ratings
              </Typography>
              <Slider
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>
          {resultPerPage < productsCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
          
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
