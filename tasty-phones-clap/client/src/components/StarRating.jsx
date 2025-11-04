import React from "react";
import { Rate } from "antd";

const StarRating = ({ rating = 4 }) => {
  return <Rate disabled allowHalf defaultValue={rating} />;
};

export default StarRating;
