import React from "react";
import StarRatingComponent from "react-star-rating-component";
import Rating from "react-rating";
const StarRating = ({ value , className}) => {
    return (
        <div className={className}>
            <Rating
            initialRating={value}
            readonly
            emptySymbol={<span style={{ color: "#ccc", fontSize: "24px"}}>★</span>}
            fullSymbol={<span style={{ color: "#FFD700", fontSize: "24px" }}>★</span>}
            />
        </div>
      );
    };
    

export default StarRating;