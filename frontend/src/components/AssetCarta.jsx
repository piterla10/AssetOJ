import React from "react";

const AssetCarta = ({ asset }) => {
  return (
    <div className="asset-card">
      <img src={asset.image} alt={asset.title} />
      <h3>{asset.title}</h3>
      <p>{asset.author}</p>
      <p>⭐ {asset.rating} | ❤️ {asset.likes}</p>
    </div>
  );
};

export default AssetCarta;
