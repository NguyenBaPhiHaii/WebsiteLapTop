import React, { useState } from "react";
import "./CartItemCard.css";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";

const CartItemCard = ({ item, deleteCartItems }) => {
  const alert = useAlert();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleted, setDeleted] = useState(false); 

  const handleRemove = () => {
    setIsDeleting(true);
    setDeleteError(null); 
  };

  const confirmDelete = async () => {
    try {
      await deleteCartItems(item.product);
      setDeleted(true); 
      alert.success(`Removed ${item.name} successfully`);
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError("An error occurred while removing");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleting(false);
  };

  return (
    <div className="CartItemCard">
      <img src={item.image} alt="ssa" />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price: $${item.price}`}</span>
        <p onClick={handleRemove}>Delete</p>
      </div>

      {isDeleting && (
        <div>
          <div className="overlay"></div>
          <div className="confirmation-dialog">
            <p className="confirm-h1">{`Are you sure you want to delete productt?`}</p>

            <div className="btn-container">
              <p className="confirm-p">{`Delete ${item.name} product?`}</p>

              <button onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-btn" disabled={deleted}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteError && <p className="error-message">{deleteError}</p>}
      {deleted && <p className="success-message">{`Removed ${item.name} successfully`}</p>}
    </div>
  );
};

export default CartItemCard;
