import React, { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminProduct,
  deleteProduct,
} from "../../actions/productAction";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { DELETE_PRODUCT_RESET } from "../../constants/productConstants";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error = null, products = [] } = useSelector((state) => state.products) || {};
  const { error: deleteError = null, isDeleted } = useSelector((state) => state.product) || {};
  
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedProductId, setDeletedProductId] = useState(null);

  const deleteProductHandler = (id) => {
    setDeletedProductId(id);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteProduct(deletedProductId));
    setShowConfirmationDialog(false);
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setDeletedProductId(null);
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
      alert.success("Product Deleted Successfully");
      navigate("/admin/dashboard");
      dispatch({ type: DELETE_PRODUCT_RESET });
    }

    dispatch(getAdminProduct());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 280,
      flex: 0.7,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      minWidth: 270,
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
        return (
          <Fragment>
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <EditIcon style={{ marginTop: "23px" }} />
            </Link>
            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];
  products &&
    products.forEach((item) => {
      rows.push({
        id: item._id,
        stock: item.Stock,
        price: item.price,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL PRODUCTS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL PRODUCTS</h1>
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
                <p className="confirm-h1">{`Are you sure you want to delete product?`}</p>
                <div className="btn-container">
                  <p className="confirm-p">{`Delete product with ID ${deletedProductId}?`}</p>
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

export default ProductList;
