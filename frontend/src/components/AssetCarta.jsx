import React from "react";
import StarRating from "./estrellas";

const AssetCarta = ({ asset }) => {
  return (
    <div className="asset-card">
      <img src={asset.imagenes[0]} alt={asset.nombre}/>
      <p>{asset.autor.nombre}</p>
      <h3>{asset.nombre}</h3>
      <p><StarRating value={asset.valoracionNota} className="starRating" /> ({asset.valoracion}) | ❤️ ({asset.likes})</p>
    </div>
  );
};

export default AssetCarta;
