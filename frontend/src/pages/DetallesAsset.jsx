import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import assetService from '../features/assets/assetService';
import StarRating from '../components/estrellas';

function DetallesAsset() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [imgPrincipal, setImgPrincipal] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const data = await assetService.getAsset(id);
        setAsset(data.assets);
        setImgPrincipal(data.assets.imagenes[0]);
      } catch (error) {
        console.error("Error al obtener el asset:", error);
      }
    };
    fetchAsset();
  }, [id]);
  

  if (!asset) return <p>Error al cargar el asset</p>;

  return (
    <>
    <div className="detalles-asset">
      <div className='izquierda'>
        <img className='imgPrincipal' src={imgPrincipal} alt="Imagen principal" />
        <div className="galeria">
          {asset.imagenes.map((img, i) => (
            <img key={i} src={img} onClick={() => setImgPrincipal(img)}/>
          ))}
        </div>
        <div className='stats'>
          <span><img src="/descarga.png" style={{height: "30px", width: "30px"}}/> ({asset.descargas})</span>
          <span><StarRating value={asset.valoracionNota} lugar={1}/> ({asset.valoracionNota})</span>
          <span>❤️ ({asset.likes})</span>
        </div>
        <h2>Etiquetas:</h2>
        <div className='etiquetas'>
          {asset.etiquetas.map((etiqueta, i) => (
            <span key={i}>{etiqueta}</span>
          ))}
        </div>
      </div>
      
      <div className="derecha" style={{ border: "1px solid #bababa"}}>
        <h2 className='autor-detalles'>{asset.nombre}</h2>
        <hr style={{width: "90%"}}/>
        <div className='caja-detalles'>
          <h2 style={{color: "#bababa"}}>Información del autor</h2>
          <div className="autor-box">
            <span> <img src={asset.autor.imagenPerfil} alt="imagen del autor" style={{width: "30px", height:"30px"}}/>{asset.autor.nombre}</span>
            <div className="separador"></div>
            <span><StarRating value={asset.autor.valoracionesNota} lugar={1}/> ({asset.autor.valoracionesNum})</span>
            <div className="separador"></div>
            <span>❤️({asset.autor.seguidos.length})</span>
          </div>
          <div className="autor-desc">
            <p>{asset.autor.informacionAutor}</p>
          </div>
        </div>
      </div>
    </div>


    {/* <div className="descripcion">
      <h2>Descripción</h2>
      <p>{asset.descripcion}</p>
    </div>

    <div className="comentarios">
      <h2>Comentarios</h2>
    </div> */}
    </>
  );
}

export default DetallesAsset