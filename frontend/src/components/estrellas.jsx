import React from "react";
import Rating from "react-rating";

const StarRating = ({ value , className, lugar = null}) => {
  let size;

  if (lugar === 1) {
    size = "35px";
  } else if (lugar === 2) {
    size = "24px";
  } else {
    size = "14px";
  }
  const emptyStyle = { color: "#ccc", fontSize: size };
  const fullStyle = { color: "#FFD700", fontSize: size };

  return (
    <span className={className}>
      <Rating
        initialRating={value}
        readonly
        emptySymbol={<span style={emptyStyle}>★</span>}
        fullSymbol={<span style={fullStyle}>★</span>}
          />
    </span>
  );
};
    

export default StarRating;