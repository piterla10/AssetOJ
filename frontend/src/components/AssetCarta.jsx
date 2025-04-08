import React from "react";
import StarRating from "./estrellas";
import { Link } from "react-router-dom";

const AssetCarta = ({ asset }) => {
  return (
    <Link to={`/DetallesAsset/${asset._id}`}>
      <div className="asset-card">
        <img src={asset.imagenes[0]} alt={asset.autor.nombre}/>
        <span className="autor">{asset.autor.nombre}</span>
        <h3>{asset.nombre}</h3>
        <p><StarRating value={asset.valoracionNota}/> ({asset.valoracion}) &nbsp;&nbsp;&nbsp;|&nbsp; ❤️ ({asset.likes})</p>
      </div>
    </Link>
  );
};

export default AssetCarta;
