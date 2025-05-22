import React from "react";
import StarRating from "./estrellas";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AssetCarta = ({ asset }) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate(`/DetallesAsset/${asset._id}`);
    } else {
      navigate('/login'); // o mostrar un modal: "Necesitas iniciar sesión"
    }
  };

  return (
    <div className="asset-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <img src={asset.imagenes[0]} alt={asset.autor.nombre} />
      <span className="autor">{asset.autor.nombre}</span>
      <h3>{asset.nombre}</h3>
      <p>
        <StarRating value={asset.valoracionNota} /> ({asset.valoracion.length}) &nbsp;&nbsp;&nbsp;|&nbsp; ❤️ ({asset.likes.length})
      </p>
    </div>
  );
};

export default AssetCarta;
