import React, { Fragment, useState, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstants";
import { useNavigate } from "react-router-dom";

const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { error, users } = useSelector((state) => state.allUsers);
  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.profile);

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [deletedUserId, setDeletedUserId] = useState(null);

  const deleteUserHandler = (id) => {
    setDeletedUserId(id);
    setShowConfirmationDialog(true);
  };

  const confirmDelete = () => {
    dispatch(deleteUser(deletedUserId));
    setShowConfirmationDialog(false);
  };

  const cancelDelete = () => {
    setShowConfirmationDialog(false);
    setDeletedUserId(null);
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
      alert.success(message);
      navigate("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
  }, [dispatch, alert, error, deleteError, navigate, isDeleted, message]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.9 },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.8,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) =>
        params.getValue(params.id, "role") === "admin" ? "greenColor" : "redColor",
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 140,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        if (params.getValue(params.id, "role") === "admin") {
          return (
            <Link
            className="edit_admin"
              style={{ lineHeight: "0px" }}
              to={`/admin/user/${params.getValue(params.id, "id")}`}
            >
              <EditIcon />
            </Link>
          );
        } else {
          return (
            <Fragment>
              <Link
                style={{ lineHeight: "0px" }}
                to={`/admin/user/${params.getValue(params.id, "id")}`}
              >
                <EditIcon />
              </Link>
              <Button
                onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}
              >
                <DeleteIcon />
              </Button>
            </Fragment>
          );
        }
      },
    },
  ];

  const rows = [];
  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin`} />
      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL USERS</h1>
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
                <p className="confirm-h1">{`Are you sure you want to delete user?`}</p>
                <div className="btn-container">
                  <p className="confirm-p">{`Delete user with ID ${deletedUserId}?`}</p>
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

export default UsersList;
