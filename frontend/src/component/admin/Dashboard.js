import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar.js";
import "./dashboard.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProduct } from "../../actions/productAction";
import { getAllOrders } from "../../actions/orderAction.js";
import { getAllUsers } from "../../actions/userAction.js";
import MetaData from "../layout/MetaData";
import { Chart, CategoryScale, LinearScale, BarElement, PointElement, ArcElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from "react-chartjs-2";

Chart.register(CategoryScale, LinearScale, BarElement, PointElement, ArcElement, LineElement);

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products = [] } = useSelector((state) => state.products) || {};
  const { orders = [] } = useSelector((state) => state.allOrders) || {};
  const { users = [] } = useSelector((state) => state.allUsers) || {};

  const [totalAmountDelivered, setTotalAmountDelivered] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(getAdminProduct());
      dispatch(getAllUsers());
      dispatch(getAllOrders());
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (orders.length > 0) {
      const deliveredAmount = orders.reduce((total, item) => {
        if (item.orderStatus === 'Delivered') {
          return total + item.totalPrice;
        }
        return total;
      }, 0);
      setTotalAmountDelivered(deliveredAmount);
    }
  }, [orders]);

  const outOfStockCount = products.filter(item => item.Stock === 0).length;
  const inStockCount = products.filter(item => item.Stock > 0).length;

  const data = {
    labels: ["Products", "Orders", "Users"],
    datasets: [
      {
        label: "Counts",
        data: [products.length, orders.length, users.length],
        backgroundColor: ["rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)"],
        borderWidth: 1,
        categoryPercentage: 0.5,
      },
    ],
  };

  const lineState = {
    labels: ["Initial Amount", "Amount Earned"],
    datasets: [
      {
        label: "TOTAL AMOUNT",
        backgroundColor: ["tomato"],
        hoverBackgroundColor: ["rgb(197, 72, 49)"],
        data: [0, totalAmountDelivered],
      },
    ],
  };

  const doughnutState = {
    labels: ["Out of Stock", "InStock"],
    datasets: [
      {
        backgroundColor: ["#e94848", "#0a997a"],
        hoverBackgroundColor: ["#cf2929", "#086450"],
        data: [outOfStockCount, inStockCount],
      },
    ],
  };

  return (
    <div className="dashboard">
      <MetaData title="Dashboard - Admin Panel" />
      <Sidebar />

      <div className="dashboardContainer">
        <Typography component="h1" style={{color:"crimson", fontSize:"40px"}}>Dashboard</Typography>

        <div className="dashboardSummary">
          <div>
            <p>
              Total Order Amount <br /> ${orders.reduce((total, item) => total + item.totalPrice, 0)}
            </p>
            <p>
              Total Order Amount Delivered <br /> ${totalAmountDelivered}
            </p>
          </div>
          <div className="dashboardSummaryBox2">
            {[
              { to: "/admin/products", label: "Products", count: products.length },
              { to: "/admin/orders", label: "Orders", count: orders.length },
              { to: "/admin/users", label: "Users", count: users.length },
            ].map((item) => (
              <Link to={item.to} key={item.to}>
                <p>{item.label}</p>
                <p>{item.count}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="barChart">
          <Bar data={data} />
        </div>

        <div className="doughnutChart" style={{marginTop: "50px"}}>
        <h1 style={{textAlign: "center"}}>
          <h3>Products:</h3>
          {/* <span style={{color: "#0a997a"}}>InStock</span> & <span style={{color: "#e94848"}}>OutOfStock</span> */}
        </h1>
        <Doughnut data={doughnutState} />

        <div style={{textAlign: "center", marginTop: "10px"}}>
          <h2 style={{color:"crimson"}}>
            Out of Stock: {outOfStockCount}
          </h2>
          <h2 style={{color:"rgb(10, 153, 122)"}}>
            In Stock: {inStockCount}
          </h2>
        </div>
      </div>

        <div className="lineChart" style={{marginTop:"50px"}}>
          <h1 style={{textAlign: "center"}}>TOTAL AMOUNT PAID</h1>
          <Line data={lineState} />
        </div>
        
      </div>
    </div>
  );
  
};
export default Dashboard;
