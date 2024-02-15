import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WebFont from "webfontloader";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSelector } from "react-redux";

// Import your components
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/Footer/Footer.js";
import Home from "./component/Home/Home.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Products from "./component/Product/Products.js";
import Search from "./component/Product/Search.js";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Payments from "./component/User/Payments.js";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import PayButton from "./component/Cart/PayButton";
import Paypal from "./component/Cart/Paypal";
import OrderSuccess from "./component/Cart/OrderSucces";
import MyOrders from "./component/Order/MyOrders";
import OrderDetails from "./component/Order/OrderDetails";
import Dashboard from "./component/admin/Dashboard";
import ProductList from "./component/admin/ProductList";
import NewProduct from "./component/admin/NewProduct.js";
import UpdateProduct from "./component/admin/UpdateProduct.js";
import OrderList from "./component/admin/OrderList.js";
import ProcessOrder from "./component/admin/ProcessOrder.js";
import AdminComponent from "./component/admin/new.js";
import EditNewsComponent from "./component/admin/EditNewsComponent.js";
import NewsForm from "./component/admin/NewsForm.js";
import UsersList from "./component/admin/UsersList.js";
import UpdateUser from "./component/admin/UpdateUser.js";
import ProductReviews from "./component/admin/ProductReviews.js";
import About from "./component/layout/About/About.js";
import Contact from "./component/layout/Contact/Contact.js";
import NotFound from "./component/layout/NotFound/NotFound";
import News from "./component/New/NewsComponent.js"
import NewsDetail from "./component/New/NewsDetail.js"

// import ProtectedRoute from "./component/Route/ProtectedRoute";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());

    getStripeApiKey();
  }, []);
  
  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />

        <Route path="/search" element={<Search />} />

        <Route
          path="/account"
          element={
            isAuthenticated ? (
              <Profile />
            ) : (
              <Navigate to="/login" state={{ from: "/account" }} />
            )
          }
        />
        <Route path="/login" element={<LoginSignUp />} />

        <Route path="/me/update" element={<UpdateProfile />} />

        <Route path="/password/update" element={<UpdatePassword />} />

        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/password/reset/:token" element={<ResetPassword />} />


        <Route path="/login/shipping" element={<Shipping />} />

        <Route path="/stripe" element={<PayButton />} />


          
        <Route
          path="/process/payment"
          element={
            stripeApiKey ? (
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
              </Elements>
            ) : null
          }
/>
        <Route path="/paypal" element={<Paypal />} />

        <Route path="/payments" element={<Payments />} />


        <Route path="/success" element={<OrderSuccess />} />
      
        <Route path="/orders" element={<MyOrders />} />

        <Route path="/order/confirm" element={<ConfirmOrder />} />

        <Route path="/order/:id" element={<OrderDetails />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />

        <Route path="/admin/products" element={<ProductList />} />

        <Route path="/admin/product" element={<NewProduct />} />

        <Route path="/admin/product/:id" element={<UpdateProduct />} />

        <Route path="/admin/news" element={<AdminComponent />} />
        
        <Route path="/admin/new" element={<NewsForm />} />

        <Route path="/admin/editnews/:id" element={<EditNewsComponent />} />

        <Route path="/admin/orders" element={<OrderList />} />

        <Route path="/admin/order/:id" element={<ProcessOrder />} />

        <Route path="/admin/users" element={<UsersList />} />

        <Route path="/admin/user/:id" element={<UpdateUser />} />

        <Route path="/admin/reviews" element={<ProductReviews />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/news" element={<News />} />

        <Route path="/news/:id" element={<NewsDetail />} />

        <Route path="*" element={<NotFound/>} />

        <Route path="/cart" element={<Cart />} />

      </Routes>
      <Footer />
      
    </Router>
  );
}

export default App;
