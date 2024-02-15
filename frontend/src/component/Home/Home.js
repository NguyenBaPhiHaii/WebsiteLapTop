import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import Slideshow from "./Slideshow";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct, } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";
// import { Link } from "react-router-dom";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error, alert]);
  
  // Sắp xếp sản phẩm từ cũ nhất đến mới nhất
  const sortedProducts = [...products].sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  
 

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          
          <MetaData title="HOME -- FSHOP" />
          
          <div className="banner">
            <h2>
              Welcome to <span style={{ color: "rgb(255, 19, 0)", fontSize: "45px" }}>FShop .</span>
            </h2>
            <h1> </h1>
            <h1><span style={{ color: "#58ef58" }}>INNOVATION</span> and <span style={{ color: "#ff1300" }}>EFFICIENCY</span> </h1>

            <a href="#container">
              <button className='shopnow'>
                SHOP NOW <CgMouse />
              </button>
            </a>
          </div>

          {/* intro */}
          {/* <section className="intro">
            <ul>
              <li style={{ listStyle: "none" }}>
                <Link className="btn_intro bg1" to="/products">Latest Product About Laptops</Link>
                <div className="icon ic1"></div>
              </li>
              <li>
                <button className="btn_intro bg2">Tặng thẻ thành viên</button>
                <div className="icon ic2"></div>
              </li>
              <li>
                <button className="btn_intro bg3">Giảm giá 20% cuối tuần</button>
                <div className="icon ic3"></div>
              </li>
            </ul>
          </section> */}

          {/* Latest product */}
          <h2 className="homeHeading"  style={{ color: "green" }}>Newest Products</h2>
          <div className="container" id="container">
          {products &&
            products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          {/* Slide Show */}
          <div className="slideshow">
            <Slideshow/>
          </div>

          {/* Featured Products */}
          {/* <h2 className="homeHeading" style={{ color: "rgb(255, 19, 0)" }}>Oldest Products</h2> */}
          <div className="container" id="container">
            {sortedProducts &&
              sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
