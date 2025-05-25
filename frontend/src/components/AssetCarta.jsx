import React from "react";
import StarRating from "./estrellas";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AssetCarta = ({ asset, editar = null}) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      navigate(`/DetallesAsset/${asset._id}`);
    } else {
      navigate('/login'); // o mostrar un modal: "Necesitas iniciar sesión"
    }
  };
  
   const handleEditClick = (e) => {
    e.stopPropagation();         // evita que dispare el onClick del card
    navigate(`/EditarAsset/${asset._id}`);
  };

  return (
    <div className="asset-card" onClick={handleClick} style={{ cursor: "pointer", position: "relative" }}>
      <img src={asset.imagenes[0]} alt={asset.autor.nombre} />
      {/* Icono de editar, solo si editar===true */}
      {editar && (
        <img
          src="/editar.png"
          alt="Editar"
          onClick={handleEditClick}
          style={{
            position: "absolute",
            top: "15px",
            right: "8px",
            width: "24px",
            height: "24px",
            cursor: "pointer",
          }}
        />
      )}
      <span className="autor">{asset.autor.nombre}</span>
      <h3>{asset.nombre}</h3>
      <p>
        <StarRating value={asset.valoracionNota} /> ({asset.valoracion.length}) &nbsp;&nbsp;&nbsp;|&nbsp; ❤️ ({asset.likes.length})
      </p>
    </div>
  );
};

export default AssetCarta;
