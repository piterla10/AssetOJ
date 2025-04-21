import React, { useState } from "react";
import Rating from "react-rating";

const StarRating = ({
  value,
  userValue = null,
  editable = false,
  onChange = () => {},
  className = "",
  lugar = null,
}) => {
  const [hovering, setHovering] = useState(false);

  let size;
  if (lugar === 1) size = "35px";
  else if (lugar === 2) size = "24px";
  else size = "14px";

  const emptyStyle = { color: "#ccc", fontSize: size };
  const averageStyle = { color: "#FFD700", fontSize: size };
  const userStyle = {
    color: "transparent",
    fontSize: size,
    WebkitTextStroke: "1px #00BFFF",
  };
  const transparentStyle = {
    color: "transparent",
    fontSize: size,
  };

  const handleChange = (newValue) => {
    if (editable) {
      onChange(newValue);
    }
  };

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => editable && setHovering(true)}
      onMouseLeave={() => editable && setHovering(false)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {editable && hovering ? (
        // Modo interactivo (hover + editable)
        <Rating
          initialRating={userValue ?? 0}
          onChange={handleChange}
          emptySymbol={<span style={emptyStyle}>★</span>}
          fullSymbol={<span style={averageStyle}>★</span>}
        />
      ) : (
        <>
          {/* Valoración media */}
          <Rating
            initialRating={value}
            readonly
            emptySymbol={<span style={emptyStyle}>★</span>}
            fullSymbol={<span style={averageStyle}>★</span>}
          />
          {/* Capa del usuario si ha valorado */}
          {userValue !== null && (
            <span style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <Rating
                initialRating={userValue}
                readonly
                emptySymbol={<span style={transparentStyle}>★</span>}
                fullSymbol={<span style={userStyle}>★</span>}
              />
            </span>
          )}
        </>
      )}
    </span>
  );
};

export default StarRating;
