import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import assetService from '../features/assets/assetService';

function DetallesAsset() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [imgPrincipal, setImgPrincipal] = useState(null);

  useEffect(() => {
    // Llama a tu backend para obtener los detalles del asset por ID
    const fetchAsset = async () => {
      try{
        let data;
        data = await assetService.getAsset(id);
        setAsset(data.assets);
        setImgPrincipal(asset.imagenes[0]);
        console.log(imgPrincipal);

      }catch (error) {
        console.error("Error al obtener el asset:", error);
      }
    }

    fetchAsset();
  }, [id]);

  if (!asset) return <p>Error al cargar el asset</p>;

  return (
    <>
    <div>
      {/* Aqui las partes de la derecha y de la izq */}
      <div>
        <img src={asset.imagenes[0]} alt="Imagen principal" />
        aqui estaría la lista de imagenes con un carrousel para 
      </div>
      <div>

      </div>
    </div>
    <div>
      <h1>Descripción</h1>

    </div>
    <div>
      <h1>Comentarios</h1>
    </div>
    </>
  )
}

export default DetallesAsset