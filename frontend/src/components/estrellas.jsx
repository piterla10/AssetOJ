import React from "react";
import Rating from "react-rating";
const StarRating = ({ value , className}) => {
    return (
        <div className={className}>
            <Rating
            initialRating={value}
            readonly
            emptySymbol={<span style={{ color: "#ccc", fontSize: "14px"}}>★</span>}
            fullSymbol={<span style={{ color: "#FFD700", fontSize: "14px" }}>★</span>}
            />
        </div>
      );
    };
    

export default StarRating;