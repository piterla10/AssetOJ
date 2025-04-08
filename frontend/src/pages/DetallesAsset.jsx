import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import assetService from '../features/assets/assetService';

function DetallesAsset() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    // Llama a tu backend para obtener los detalles del asset por ID
    const fetchAsset = async () => {
      setAsset(await assetService.getAsset(id));
    }

    fetchAsset();
  }, [id]);

  if (!asset) return <p>Cargando...</p>;

  return (
    <div>DetallesAsset</div>
  )
}

export default DetallesAsset