import React, { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from '@material-ui/icons/Edit'; 
import DeleteIcon from '@material-ui/icons/Delete'; 
import SideBar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import {
  deleteOrder,
  getAllOrders,
  clearErrors,
} from "../../actions/orderAction";
import { DELETE_ORDER_RESET } from "../../constants/orderConstants";
import "./productList.css";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, orders } = useSelector((state) => state.allOrders);
  const { error: deleteError, isDeleted } = useSelector((state) => state.order);

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedOrderId, setDeletedOrderId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveredAmount, setDeliveredAmount] = useState(0);

  const deleteOrderHandler = (id) => {
    setDeletedOrderId(id);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteOrder(deletedOrderId));
    setShowConfirmationDialog(false);
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setDeletedOrderId(null);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      navigate("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  useEffect(() => {
    if (orders) {
      let total = 0;
      let delivered = 0;
      orders.forEach((item) => {
        total += item.totalPrice;
        if (item.orderStatus === 'Delivered') {
          delivered += item.totalPrice;
        }
      });
      setTotalAmount(total);
      setDeliveredAmount(delivered);
    }
  }, [orders]);

  const columns = [
    { field: "userName", headerName: "User Name", minWidth: 80, flex: 0.5}, 
    { field: "createdAt", headerName: "Created At", minWidth: 80, flex: 0.6 }, 
    {
      field: "status",
      headerName: "Status",
      minWidth: 110,
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 170,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        if (params.getValue(params.id, "status") === "Delivered") {
          return (
            <Link className="edit_admin" style={{ lineHeight: "0px" }} to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>
          );
        } else {
          return (
            <Fragment>
              <Link style={{ lineHeight: "0px" }} to={`/admin/order/${params.getValue(params.id, "id")}`}>
                <EditIcon />
              </Link>
              <Button
                onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}
              >
                <DeleteIcon style={{ lineHeight: "0" }} />
              </Button>
            </Fragment>
          );
        }
      },
    },
  ];

  const rows = [];

  orders &&
  orders.forEach((item) => {
    rows.push({
      id: item._id,
      userName: item.userName,
      createdAt: new Date(item.createdAt).toLocaleString(),
      itemsQty: item.orderItems.length,
      amount: item.totalPrice,
      status: item.orderStatus,
    });
  });

  return (
    <Fragment>
      <MetaData
        title={`ALL ORDERS - Admin`}
        totalAmount={totalAmount}
        deliveredAmount={deliveredAmount}
      />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL ORDERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 20, 50]}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />

          {showConfirmationDialog && (
            <div className="overlay">
              <div className="confirmation-dialog">
                <p className="confirm-h1">{`Are you sure you want to delete order?`}</p>
                <div className="btn-container">
                  <p className="confirm-p">{`Delete order with ID ${deletedOrderId}?`}</p>
                  <button onClick={() => cancelDelete()} className="cancel-btn">
                    Cancel
                  </button>
                  <button onClick={() => confirmDelete()} className="confirm-btn">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;
