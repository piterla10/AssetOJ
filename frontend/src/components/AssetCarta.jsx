import React from "react";
import StarRating from "./estrellas";

const AssetCarta = ({ asset }) => {
  return (
    <div className="asset-card">
      <img src={asset.imagenes[0]} alt={asset.nombre}/>
      <span className="autor">{asset.autor}</span>
      <h3>{asset.nombre}</h3>
      <p><StarRating value={asset.valoracionNota}/> ({asset.valoracion}) &nbsp;&nbsp;&nbsp;|&nbsp; ❤️ ({asset.likes})</p>
    </div>
  );
};

export default AssetCarta;
