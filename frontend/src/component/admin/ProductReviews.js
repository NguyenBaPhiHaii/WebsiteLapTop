import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productReviews.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@material-ui/icons/Delete";
import Star from "@material-ui/icons/Star";
import { useNavigate } from "react-router-dom";

import SideBar from "./Sidebar";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const alert = useAlert();

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review || {}
  );

  const { error, reviews, loading } = useSelector(
    (state) => state.productReviews || {}
  );

  const [productId, setProductId] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedReviewId, setDeletedReviewId] = useState(null);

  const deleteReviewHandler = (reviewId) => {
    setDeletedReviewId(reviewId);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteReviews(deletedReviewId, productId));
    setShowConfirmationDialog(false);
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setDeletedReviewId(null);
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviews(productId));
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review Deleted Successfully");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, alert, error, deleteError, navigate, isDeleted, productId]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },
    {
      field: "user",
      headerName: "User",
      minWidth: 150,
      flex: 0.4,
    },
    {
      field: "comment",
      headerName: "Comment",
      minWidth: 250,
      flex: .6,
    },
    {
      field: "date",
      headerName: "Date Review",
      type: "date",
      minWidth: 180,
      flex: 0.4,
      renderCell: (params) => {
        const date = new Date(params.row.createdAt);
        return date.toLocaleDateString(); // Điều chỉnh định dạng ngày tháng theo yêu cầu
      },
    },
    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "greenColor"
          : "redColor";
      },
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
            <Button
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
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

  if (reviews) {
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
        createdAt: item.createdAt, // Giả sử ngày tháng được lưu trong trường createdAt
      });
    });
  }

  return (
    <Fragment>
      <MetaData title={`ALL REVIEWS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productReviewsContainer">
          <form
            className="productReviewsForm"
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="productReviewsFormHeading">ALL REVIEWS</h1>

            <div>
              <Star />
              <input
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading || productId === ""}
            >
              Search
            </Button>
          </form>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 20, 50]}
              disableSelectionOnClick
              className="productListTable"
              autoHeight
            />
          ) : (
            <h1 className="productReviewsFormHeading">No Reviews Found</h1>
          )}

          {showConfirmationDialog && (
            <div className="overlay">
              <div className="confirmation-dialog">
                <p className="confirm-h1">{`Are you sure you want to delete this review?`}</p>
                <div className="btn-container">
                  <p className="confirm-p">{`Delete review with ID ${deletedReviewId}?`}</p>
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

export default ProductReviews;
