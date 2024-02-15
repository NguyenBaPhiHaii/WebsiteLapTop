import { Rating } from "@material-ui/lab";
import React from "react";
// import { useSelector } from "react-redux";
import profilePng from "../../images/Profile.png";
import { format } from "date-fns";
import "./ProductDetails.css";


const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };
  // const { user } = useSelector((state) => state.user);

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      {/* <img src={user.avatar.url} alt={user.name} /> */}
      <p>{review.name}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.comment}</span>
      <p className="reviewCardTime">
        {format(new Date(review.createdAt), "dd/MM/yyyy HH:mm")}
      </p>
    </div>
  );
};

export default ReviewCard;
