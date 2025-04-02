import React from "react";

const AssetCarta = ({ asset }) => {
  return (
    <div className="asset-card">
      <img src={asset.imagenes[0]} alt={asset.nombre} />
      <h3>{asset.nombre}</h3>
      {/*<p>{asset.author}</p>*/}
      <p>⭐ {asset.valoracion} | ❤️ {asset.likes}</p>
    </div>
  );
};

export default AssetCarta;
